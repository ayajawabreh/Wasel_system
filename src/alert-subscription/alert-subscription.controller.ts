import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AlertSubscriptionService } from './alert-subscription.service';
import { CreateAlertSubscriptionDto } from './dto/create-alert-subscription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth';

@Controller('alert-subscription')
@UseGuards(JwtAuthGuard)
export class AlertSubscriptionController {
  constructor(
    private readonly alertSubscriptionService: AlertSubscriptionService,
  ) {}

  @Post()
  async create(
    @Body() createAlertSubscriptionDto: CreateAlertSubscriptionDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return await this.alertSubscriptionService.create(
      userId,
      createAlertSubscriptionDto,
    );
  }

  @Get('my')
  async findMySubscriptions(@Req() req: any) {
    const userId = req.user.sub;

    return await this.alertSubscriptionService.findMySubscriptions(userId);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ) {
    const userId = req.user.sub;

    return await this.alertSubscriptionService.remove(id, userId);
  }
}