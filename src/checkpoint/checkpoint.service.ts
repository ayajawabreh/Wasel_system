import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Checkpoint } from './entities/checkpoint.entity';
import { CheckpointStatusHistory } from './entities/checkpoint-status-history.entity';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';

@Injectable()
export class CheckpointService {
  constructor(
    @InjectRepository(Checkpoint)
    private readonly checkpointRepository: Repository<Checkpoint>,
    @InjectRepository(CheckpointStatusHistory)
    private readonly historyRepository: Repository<CheckpointStatusHistory>,
  ) {}

  async create(dto: CreateCheckpointDto) {
    const checkpoint = this.checkpointRepository.create(dto);
    return await this.checkpointRepository.save(checkpoint);
  }

  async findAll(status?: string, page = 1, limit = 10) {
    const query = this.checkpointRepository.createQueryBuilder('checkpoint');
    if (status) {
      query.where('checkpoint.current_status = :status', { status });
    }
    query.skip((page - 1) * limit).take(limit);
    const [data, total] = await query.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: number) {
    const checkpoint = await this.checkpointRepository.findOne({ where: { id } });
    if (!checkpoint) throw new NotFoundException('Checkpoint not found');
    return checkpoint;
  }

  async update(id: number, dto: UpdateCheckpointDto) {
    const checkpoint = await this.findOne(id);
    if (dto.current_status && dto.current_status !== checkpoint.current_status) {
      await this.historyRepository.save({
        checkpoint_id: id,
        status: dto.current_status,
      });
    }
    await this.checkpointRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const result = await this.checkpointRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException('Checkpoint not found');
    return { deleted: true };
  }

  async getStatusHistory(id: number) {
    await this.findOne(id);
    return this.historyRepository.find({
      where: { checkpoint_id: id },
      order: { changed_at: 'DESC' },
    });
  }
}