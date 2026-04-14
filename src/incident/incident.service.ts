import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Incident } from './entities/incident.entity';
import { AlertService } from '../alert/alert.service';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,

    private readonly alertService: AlertService,
  ) {}

  async verifyIncident(id: number, userId: number) {
    const incident = await this.incidentRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    incident.status = 'verified';
    incident.verified_by = userId;

    const savedIncident = await this.incidentRepository.save(incident);

    await this.alertService.createAlertsForVerifiedIncident(savedIncident);

    return {
      message: 'Incident verified successfully',
      incident: savedIncident,
    };
  }

  async findAll() {
    return await this.incidentRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOne({
      where: { id },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }
}