import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReportVote } from './entities/report-vote.entity';

@Injectable()
export class ReportVoteService {
  constructor(
    @InjectRepository(ReportVote)
    private reportVoteRepo: Repository<ReportVote>,
  ) {}

  findAll() {
    return this.reportVoteRepo.find();
  }

  async create(data: any) {
    const existingVote = await this.reportVoteRepo.findOne({
      where: {
        user_id: data.user_id,
        report_id: data.report_id,
      },
    });

    if (existingVote) {
      return {
        message: 'User already voted on this report',
        existingVote,
      };
    }

    return this.reportVoteRepo.save(data);
  }
}