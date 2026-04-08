import { Controller, Get, Param, Post, Body, Patch } from '@nestjs/common';
import { ReportService } from './report.service';
import { CreateReportDto } from './dto/create-report.dto';
import { Delete } from '@nestjs/common';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get()
  findAll() {
    return this.reportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportService.findOne(+id);
  }

  @Post()
  create(@Body() body: CreateReportDto) {
    return this.reportService.create(body);
  }
  @Get(':id/score')
getScore(@Param('id') id: string) {
  return this.reportService.getScore(+id);
  
}
@Patch(':id/status')
updateStatus(@Param('id') id: string, @Body() body: any) {
  return this.reportService.updateStatus(+id, body.status);
}
@Post(':id/approve')
approve(@Param('id') id: string) {
  return this.reportService.approveReport(+id, 1);
}
@Delete(':id')
remove(@Param('id') id: string) {
  return this.reportService.delete(+id);
}
}