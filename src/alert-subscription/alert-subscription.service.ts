import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AlertSubscription } from './entities/alert-subscription.entity';
import { CreateAlertSubscriptionDto } from './dto/create-alert-subscription.dto';

@Injectable()
export class AlertSubscriptionService {
  constructor(
    @InjectRepository(AlertSubscription)
    private readonly alertSubscriptionRepository: Repository<AlertSubscription>,
  ) {}

  async create(userId: number, createAlertSubscriptionDto: CreateAlertSubscriptionDto) {
    const subscription = this.alertSubscriptionRepository.create({
      user_id: userId,
      region: createAlertSubscriptionDto.region,
      category: createAlertSubscriptionDto.category,
    });

    return await this.alertSubscriptionRepository.save(subscription);
  }

  async findMySubscriptions(userId: number) {
    return await this.alertSubscriptionRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async remove(id: number, userId: number) {
    const subscription = await this.alertSubscriptionRepository.findOne({
      where: { id: id, user_id: userId },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    await this.alertSubscriptionRepository.remove(subscription);

    return { message: 'Subscription deleted successfully' };
  }
}