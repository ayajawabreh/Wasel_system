import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportVote } from './entities/report-vote.entity';
import { ReportVoteService } from './report-vote.service';
import { ReportVoteController } from './report-vote.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ReportVote])],
  controllers: [ReportVoteController],
  providers: [ReportVoteService],
})
export class ReportVoteModule {}