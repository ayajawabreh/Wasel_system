import { Controller, Get, Req, UseGuards } from '@nestjs/common';

import { AlertService } from './alert.service';
import { JwtAuthGuard } from '../auth/jwt-auth';

@Controller('alert')
@UseGuards(JwtAuthGuard)
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  @Get('my')
  async findMyAlerts(@Req() req: any) {
    const userId = req.user.sub;
    return await this.alertService.findMyAlerts(userId);
  }
}