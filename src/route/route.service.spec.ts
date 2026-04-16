import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { of, throwError } from 'rxjs';
import { RouteService } from './route.service';
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity';
import { Incident } from '../incident/entities/incident.entity';
import { Area } from '../area/entities/area.entity';

describe('RouteService', () => {
  let service: RouteService;

  const mockCheckpointRepository = {
    find: jest.fn(),
  };

  const mockIncidentRepository = {
    find: jest.fn(),
  };

  const mockAreaRepository = {
    createQueryBuilder: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RouteService,
        {
          provide: getRepositoryToken(Checkpoint),
          useValue: mockCheckpointRepository,
        },
        {
          provide: getRepositoryToken(Incident),
          useValue: mockIncidentRepository,
        },
        {
          provide: getRepositoryToken(Area),
          useValue: mockAreaRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RouteService>(RouteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return cached result if cache exists', async () => {
    const cachedResult = {
      estimatedDistance: 7.52,
      estimatedDuration: 21.66,
      metadata: {
        factors: ['cached result'],
        avoidCheckpoints: true,
        avoidAreas: ['Area A'],
        routingSource: 'OSRM',
        weatherSource: 'Open-Meteo',
      },
    };

    mockCacheManager.get.mockResolvedValue(cachedResult);

    const result = await service.estimateRoute({
      startLatitude: 31.95,
      startLongitude: 35.93,
      endLatitude: 31.98,
      endLongitude: 35.96,
      avoidCheckpoints: true,
      avoidAreas: ['Area A'],
    });

    expect(result).toEqual(cachedResult);
    expect(mockCacheManager.get).toHaveBeenCalled();
    expect(mockHttpService.get).not.toHaveBeenCalled();
  });

  it('should apply avoid area penalties from database', async () => {
    mockCacheManager.get.mockResolvedValue(null);

    mockHttpService.get
      .mockReturnValueOnce(
        of({
          data: {
            routes: [
              {
                distance: 7520,
                duration: 1000,
              },
            ],
          },
        }),
      )
      .mockReturnValueOnce(
        of({
          data: {
            current: {
              weather_code: 1,
            },
          },
        }),
      );

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([
        {
          id: 1,
          name: 'Area A',
          latitude: 31.95,
          longitude: 35.93,
          radiusKm: 2,
          penaltyMinutes: 6,
          penaltyDistanceKm: 1.2,
          isActive: true,
        },
      ]),
    };

    mockAreaRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    mockCheckpointRepository.find.mockResolvedValue([]);
    mockIncidentRepository.find.mockResolvedValue([]);

    const result = await service.estimateRoute({
      startLatitude: 31.95,
      startLongitude: 35.93,
      endLatitude: 31.98,
      endLongitude: 35.96,
      avoidCheckpoints: true,
      avoidAreas: ['Area A'],
    });

    expect(result.estimatedDistance).toBe(8.72);
    expect(result.estimatedDuration).toBeCloseTo(22.67, 2);
    expect(result.metadata.factors).toContain(
      'Alternative path applied to avoid area: Area A',
    );
    expect(result.metadata.avoidAreas).toEqual(['Area A']);
    expect(mockCacheManager.set).toHaveBeenCalled();
  });

  it('should continue when weather API fails', async () => {
    mockCacheManager.get.mockResolvedValue(null);

    mockHttpService.get
      .mockReturnValueOnce(
        of({
          data: {
            routes: [
              {
                distance: 5000,
                duration: 600,
              },
            ],
          },
        }),
      )
      .mockReturnValueOnce(
        throwError(() => new Error('Weather API failed')),
      );

    const mockQueryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };

    mockAreaRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

    mockCheckpointRepository.find.mockResolvedValue([]);
    mockIncidentRepository.find.mockResolvedValue([]);

    const result = await service.estimateRoute({
      startLatitude: 31.95,
      startLongitude: 35.93,
      endLatitude: 31.98,
      endLongitude: 35.96,
      avoidCheckpoints: false,
      avoidAreas: [],
    });

    expect(result.estimatedDistance).toBe(5);
    expect(result.estimatedDuration).toBe(10);
    expect(result.metadata.weatherSource).toBe('Unavailable');
    expect(result.metadata.factors).toContain(
      'Weather data unavailable, route estimated without weather adjustment',
    );
  });
});