import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident } from './entities/incident.entity';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';

@Injectable()
export class IncidentService {
  constructor(
    @InjectRepository(Incident)
    private readonly incidentRepository: Repository<Incident>,
  ) {}

  async create(dto: CreateIncidentDto, userId: number) {
    const incident = this.incidentRepository.create({
      ...dto,
      reported_by: userId,
      status: 'pending',
    });

    return await this.incidentRepository.save(incident);
  }

  async findAll(
    type?: string,
    severity?: string,
    status?: string,
    page = 1,
    limit = 10,
  ) {
    const query = this.incidentRepository
      .createQueryBuilder('incident')
      .leftJoinAndSelect('incident.checkpoint', 'checkpoint');

    if (type) query.andWhere('incident.type = :type', { type });
    if (severity) query.andWhere('incident.severity = :severity', { severity });
    if (status) query.andWhere('incident.status = :status', { status });

    query
      .orderBy('incident.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOne({
      where: { id },
      relations: ['checkpoint'],
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  // 🚀 FIXED UPDATE (IMPORTANT)
  async update(id: number, dto: UpdateIncidentDto) {
    const incident = await this.findOne(id);

    // safer + cleaner + no silent bugs
    Object.assign(incident, dto);

    return await this.incidentRepository.save(incident);
  }

  async verify(id: number, userId: number) {
    const incident = await this.findOne(id);

    incident.status = 'resolved';
    incident.verified_by = userId;

    return await this.incidentRepository.save(incident);
  }

  async close(id: number) {
    const incident = await this.findOne(id);

    incident.status = 'resolved';

    return await this.incidentRepository.save(incident);
  }

  async remove(id: number) {
    const result = await this.incidentRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Incident not found');
    }

    return { deleted: true };
  }
}