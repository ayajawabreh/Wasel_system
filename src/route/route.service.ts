import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { firstValueFrom, timeout, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { EstimateRouteDto } from './dto/estimate-route.dto';
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity';
import { Incident } from '../incident/entities/incident.entity';
import { Area } from '../area/entities/area.entity';

@Injectable()
export class RouteService {
  constructor(
    @InjectRepository(Checkpoint)
    private readonly checkpointRepository: Repository<Checkpoint>,

    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,

    @InjectRepository(Area)
    private readonly areaRepository: Repository<Area>,

    private readonly httpService: HttpService,

    @Inject(CACHE_MANAGER)
    private readonly cacheManager: any,
  ) {}

  async estimateRoute(dto: EstimateRouteDto) {
    const {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      avoidCheckpoints,
      avoidAreas,
    } = dto;

    const cacheKey = this.buildRouteCacheKey(dto);

    const cachedResult = await this.cacheManager.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    const baseRoute = await this.getRouteFromOsrm(
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
    );

    let distance = baseRoute.distanceKm;
    let duration = baseRoute.durationMinutes;

    const midLat = (startLatitude + endLatitude) / 2;
    const midLng = (startLongitude + endLongitude) / 2;

    let weatherCode: number | undefined;
    try {
      weatherCode = await this.getWeatherCondition(midLat, midLng);
    } catch {
      weatherCode = undefined;
    }

    const weatherImpact = this.interpretWeatherCode(weatherCode);

    const factors: string[] = [
      'Base route estimated using OSRM external routing service',
    ];

    if (weatherCode === undefined) {
      factors.push(
        'Weather data unavailable, route estimated without weather adjustment',
      );
    } else {
      factors.push(`Weather condition near route: ${weatherImpact.label}`);
      duration += weatherImpact.delay;
    }

    if (avoidAreas && avoidAreas.length > 0) {
      const appliedAreas = await this.applyAvoidAreaPenalties(
        avoidAreas,
        startLatitude,
        startLongitude,
        endLatitude,
        endLongitude,
      );

      distance += appliedAreas.extraDistanceKm;
      duration += appliedAreas.extraDurationMinutes;
      factors.push(...appliedAreas.factors);

      const unappliedAreas = avoidAreas.filter(
        (areaName) =>
          !appliedAreas.appliedAreaNames.some(
            (appliedName) => appliedName.toLowerCase() === areaName.toLowerCase(),
          ),
      );

      if (unappliedAreas.length > 0) {
        factors.push(
          `Requested avoid areas not recognized or not near route: ${unappliedAreas.join(', ')}`,
        );
      }
    }

    const checkpoints = await this.checkpointRepository.find();
    const incidents = await this.incidentRepository.find();

    for (const checkpoint of checkpoints) {
      const checkpointLat = Number(checkpoint.latitude);
      const checkpointLng = Number(checkpoint.longitude);

      const distanceToStart = this.calculateDistance(
        startLatitude,
        startLongitude,
        checkpointLat,
        checkpointLng,
      );

      const distanceToEnd = this.calculateDistance(
        endLatitude,
        endLongitude,
        checkpointLat,
        checkpointLng,
      );

      const distanceToMid = this.calculateDistance(
        midLat,
        midLng,
        checkpointLat,
        checkpointLng,
      );

      const isNearby =
        distanceToStart < 2 || distanceToEnd < 2 || distanceToMid < 2;

      if (!isNearby) continue;

      if (checkpoint.current_status === 'closed') {
        if (avoidCheckpoints) {
          duration += 4;
          factors.push(
            `Alternative path used to avoid closed checkpoint: ${checkpoint.name}`,
          );
        } else {
          duration += 10;
          factors.push(`Closed checkpoint nearby: ${checkpoint.name}`);
        }
      } else if (checkpoint.current_status === 'busy') {
        if (avoidCheckpoints) {
          duration += 2;
          factors.push(
            `Alternative path used to avoid busy checkpoint: ${checkpoint.name}`,
          );
        } else {
          duration += 5;
          factors.push(`Busy checkpoint nearby: ${checkpoint.name}`);
        }
      }
    }

    for (const incident of incidents) {
      if (incident.latitude == null || incident.longitude == null) continue;
      if (incident.status === 'resolved') continue;

      const incidentLat = Number(incident.latitude);
      const incidentLng = Number(incident.longitude);

      const distanceToStart = this.calculateDistance(
        startLatitude,
        startLongitude,
        incidentLat,
        incidentLng,
      );

      const distanceToEnd = this.calculateDistance(
        endLatitude,
        endLongitude,
        incidentLat,
        incidentLng,
      );

      const distanceToMid = this.calculateDistance(
        midLat,
        midLng,
        incidentLat,
        incidentLng,
      );

      const isNearby =
        distanceToStart < 1.5 || distanceToEnd < 1.5 || distanceToMid < 1.5;

      if (!isNearby) continue;

      if (incident.severity === 'high') {
        duration += 7;
        factors.push(`High severity incident nearby: ${incident.type}`);
      } else if (incident.severity === 'medium') {
        duration += 3;
        factors.push(`Medium severity incident nearby: ${incident.type}`);
      } else {
        duration += 1;
        factors.push(`Low severity incident nearby: ${incident.type}`);
      }
    }

    const result = {
      estimatedDistance: Number(distance.toFixed(2)),
      estimatedDuration: Number(duration.toFixed(2)),
      metadata: {
        factors,
        avoidCheckpoints: avoidCheckpoints ?? false,
        avoidAreas: avoidAreas ?? [],
        routingSource: 'OSRM',
        weatherSource: weatherCode === undefined ? 'Unavailable' : 'Open-Meteo',
      },
    };

    await this.cacheManager.set(cacheKey, result, 15 * 60 * 1000);

    return result;
  }

  private async applyAvoidAreaPenalties(
    requestedAreas: string[],
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ) {
    const midLat = (startLat + endLat) / 2;
    const midLng = (startLng + endLng) / 2;

    let extraDurationMinutes = 0;
    let extraDistanceKm = 0;
    const factors: string[] = [];
    const appliedAreaNames: string[] = [];

    if (!requestedAreas || requestedAreas.length === 0) {
      return {
        extraDurationMinutes,
        extraDistanceKm,
        factors,
        appliedAreaNames,
      };
    }

    const areas = await this.areaRepository
      .createQueryBuilder('area')
      .where('LOWER(area.name) IN (:...names)', {
        names: requestedAreas.map((name) => name.toLowerCase()),
      })
      .andWhere('area.is_active = :isActive', { isActive: true })
      .getMany();

    for (const area of areas) {
      const areaLat = Number(area.latitude);
      const areaLng = Number(area.longitude);

      const distanceToStart = this.calculateDistance(
        startLat,
        startLng,
        areaLat,
        areaLng,
      );

      const distanceToEnd = this.calculateDistance(
        endLat,
        endLng,
        areaLat,
        areaLng,
      );

      const distanceToMid = this.calculateDistance(
        midLat,
        midLng,
        areaLat,
        areaLng,
      );

      const affectsRoute =
        distanceToStart <= Number(area.radiusKm) ||
        distanceToEnd <= Number(area.radiusKm) ||
        distanceToMid <= Number(area.radiusKm);

      if (!affectsRoute) continue;

      extraDurationMinutes += Number(area.penaltyMinutes);
      extraDistanceKm += Number(area.penaltyDistanceKm);
      appliedAreaNames.push(area.name);

      factors.push(`Alternative path applied to avoid area: ${area.name}`);
    }

    return {
      extraDurationMinutes,
      extraDistanceKm,
      factors,
      appliedAreaNames,
    };
  }

  private async getRouteFromOsrm(
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
  ) {
    const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=false`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url).pipe(
          timeout(5000),
          catchError((error: AxiosError | Error) => {
            throw new ServiceUnavailableException(
              'Routing service is currently unavailable or timed out',
            );
          }),
        ),
      );

      const route = response.data?.routes?.[0];

      if (!route) {
        throw new ServiceUnavailableException(
          'Unable to fetch valid route from routing service',
        );
      }

      return {
        distanceKm: route.distance / 1000,
        durationMinutes: route.duration / 60,
      };
    } catch (error) {
      if (error instanceof ServiceUnavailableException) {
        throw error;
      }

      throw new ServiceUnavailableException(
        'Failed to estimate route using external routing service',
      );
    }
  }

  private async getWeatherCondition(lat: number, lng: number) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=weather_code`;

    try {
      const response = await firstValueFrom(
        this.httpService.get(url).pipe(
          timeout(4000),
          catchError(() => {
            throw new Error('Weather service unavailable');
          }),
        ),
      );

      return response.data?.current?.weather_code;
    } catch {
      throw new Error('Failed to fetch weather data');
    }
  }

  private interpretWeatherCode(code: number | undefined) {
    if (code === undefined || code === null) {
      return { label: 'unknown', delay: 0 };
    }

    if (code === 0) {
      return { label: 'clear', delay: 0 };
    }

    if ([1, 2, 3].includes(code)) {
      return { label: 'cloudy', delay: 0 };
    }

    if ([45, 48].includes(code)) {
      return { label: 'fog', delay: 2 };
    }

    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
      return { label: 'rain', delay: 4 };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
      return { label: 'snow', delay: 5 };
    }

    if ([95, 96, 99].includes(code)) {
      return { label: 'thunderstorm', delay: 6 };
    }

    return { label: 'other', delay: 1 };
  }

  private buildRouteCacheKey(dto: EstimateRouteDto): string {
    const {
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      avoidCheckpoints,
      avoidAreas,
    } = dto;

    const normalizedAreas = [...(avoidAreas ?? [])].sort().join('|');

    return [
      'route-estimate',
      startLatitude,
      startLongitude,
      endLatitude,
      endLongitude,
      avoidCheckpoints ?? false,
      normalizedAreas,
    ].join(':');
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return (value * Math.PI) / 180;
  }
}