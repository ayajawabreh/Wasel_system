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
    });
    return this.incidentRepository.save(incident);
  }

  async findAll(
    type?: string,
    severity?: string,
    status?: string,
    page = 1,
    limit = 10,
  ) {
    const query = this.incidentRepository.createQueryBuilder('incident');

    if (type) query.andWhere('incident.type = :type', { type });
    if (severity) query.andWhere('incident.severity = :severity', { severity });
    if (status) query.andWhere('incident.status = :status', { status });

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const incident = await this.incidentRepository.findOne({ where: { id } });
    if (!incident) throw new NotFoundException(`Incident #${id} not found`);
    return incident;
  }

  async update(id: number, dto: UpdateIncidentDto) {
    await this.findOne(id);
    await this.incidentRepository.update(id, dto);
    return this.findOne(id);
  }

  async verify(id: number, userId: number) {
    await this.findOne(id);
    await this.incidentRepository.update(id, { verified_by: userId });
    return this.findOne(id);
  }

  async close(id: number) {
    await this.findOne(id);
    await this.incidentRepository.update(id, { status: 'resolved' });
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);

    // ✅ حذف الـ alerts المرتبطة أولاً قبل حذف الـ incident
    await this.incidentRepository.query(
      `DELETE FROM alert WHERE incident_id = ?`,
      [id],
    );

    await this.incidentRepository.delete(id);
    return { message: `Incident #${id} deleted successfully` };
  }
}