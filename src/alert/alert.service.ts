import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Alert } from './entities/alert.entity';
import { AlertSubscription } from '../alert-subscription/entities/alert-subscription.entity';

@Injectable()
export class AlertService {
  constructor(
    @InjectRepository(Alert)
    private readonly alertRepository: Repository<Alert>,

    @InjectRepository(AlertSubscription)
    private readonly alertSubscriptionRepository: Repository<AlertSubscription>,
  ) {}

  async createAlertsForVerifiedIncident(incident: any) {
  const allSubscriptions = await this.alertSubscriptionRepository.find();

const subscriptions = allSubscriptions.filter(sub =>
  sub.region?.trim().toLowerCase() === incident.region?.trim().toLowerCase() &&
  sub.category?.trim().toLowerCase() === incident.type?.trim().toLowerCase()
);
    for (const subscription of subscriptions) {
      const existingAlert = await this.alertRepository.findOne({
        where: {
          user_id: subscription.user_id,
          incident_id: incident.id,
        },
      });

      if (existingAlert) {
        continue;
      }

      const alert = this.alertRepository.create({
        user_id: subscription.user_id,
        incident_id: incident.id,
        subscription_id: subscription.id,
        message: `Alert: ${incident.type} incident in ${incident.region}`,
      });

      await this.alertRepository.save(alert);
    }

    return {
      message: 'Alerts generated successfully',
    };
  }

  async findMyAlerts(userId: number) {
    return await this.alertRepository.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }
}