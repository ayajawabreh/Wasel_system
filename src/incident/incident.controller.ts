import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';

import { IncidentService } from './incident.service';
import { JwtAuthGuard } from '../auth/jwt-auth';

@Controller('incident')
@UseGuards(JwtAuthGuard)
export class IncidentController {
  constructor(private readonly incidentService: IncidentService) {}

  @Get()
  async findAll() {
    return await this.incidentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.incidentService.findOne(id);
  }

  @Patch(':id/verify')
  async verifyIncident(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    return await this.incidentService.verifyIncident(id, userId);
  }
}