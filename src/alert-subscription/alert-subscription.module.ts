import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AlertSubscription } from './entities/alert-subscription.entity';
import { AlertSubscriptionService } from './alert-subscription.service';
import { AlertSubscriptionController } from './alert-subscription.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlertSubscription]),
    AuthModule,
  ],
  controllers: [AlertSubscriptionController],
  providers: [AlertSubscriptionService],
  exports: [AlertSubscriptionService],
})
export class AlertSubscriptionModule {}