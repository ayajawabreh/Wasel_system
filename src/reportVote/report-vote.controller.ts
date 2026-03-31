import { Controller, Get, Post, Body } from '@nestjs/common';
import { ReportVoteService } from './report-vote.service';

@Controller('report-vote')
export class ReportVoteController {
  constructor(private readonly reportVoteService: ReportVoteService) {}

  @Get()
  findAll() {
    return this.reportVoteService.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.reportVoteService.create(body);
  }
}