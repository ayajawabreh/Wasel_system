import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { ReportVote } from '../reportVote/entities/report-vote.entity';
import { ModerationLog } from '../moderationlog/entities/moderation-log.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Report, ReportVote, ModerationLog])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}