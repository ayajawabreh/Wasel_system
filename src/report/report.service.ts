import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportVote } from '../reportVote/entities/report-vote.entity';
import { ModerationLog } from '../moderationlog/entities/moderation-log.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepo: Repository<Report>,

    @InjectRepository(ReportVote)
    private reportVoteRepo: Repository<ReportVote>,

    @InjectRepository(ModerationLog)
    private logRepo: Repository<ModerationLog>,
  ) {}

  findAll() {
    return this.reportRepo.find();
  }

  findOne(id: number) {
    return this.reportRepo.findOneBy({ id });
  }

  async create(data: any) {
    const existingReport = await this.reportRepo.findOne({
      where: {
        description: data.description,
        category: data.category,
        latitude: data.latitude,
        longitude: data.longitude,
      },
    });

    if (existingReport) {
      return {
        message: 'Duplicate report detected',
        existingReport,
      };
    }

    return this.reportRepo.save(data);
  }

  async getScore(reportId: number) {
    const votes = await this.reportVoteRepo.find({
      where: { report_id: reportId },
    });

    let score = 0;

    for (const vote of votes) {
     if (vote.vote_type === 'upvote') score++;
if (vote.vote_type === 'downvote') score--;
    }

    return { reportId, score };
  }

  async updateStatus(id: number, status: string) {
    await this.reportRepo.update(id, { status });
    return this.reportRepo.findOneBy({ id });
  }
async approveReport(reportId: number, moderatorId: number) {
  const report = await this.reportRepo.findOneBy({ id: reportId });

  if (!report) {
    return { message: 'Report not found' };
  }

  if (report.status === 'approved') {
    return { message: 'Report is already approved' };
  }

  await this.reportRepo.update(reportId, { status: 'approved' });

  await this.logRepo.save({
    moderator_id: moderatorId,
    action_type: 'approve',
    target_type: 'Report',
    target_id: reportId,
    reason: 'Approved by moderator',
    created_at: new Date(),
  });

  return { message: 'Report approved and logged' };
}
async delete(id: number) {
  const report = await this.reportRepo.findOneBy({ id });

  if (!report) {
    return { message: 'Report not found' };
  }

  await this.reportVoteRepo.delete({ report_id: id });

  await this.reportRepo.delete(id);

  await this.logRepo.save({
    moderator_id: 1,
    action_type: 'delete',
    target_type: 'Report',
    target_id: id,
    reason: 'Deleted by moderator',
    created_at: new Date(),
  });

  return { message: 'Report deleted successfully' };
}
}