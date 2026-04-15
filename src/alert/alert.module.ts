import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Alert } from './entities/alert.entity';
import { AlertSubscription } from '../alert-subscription/entities/alert-subscription.entity';
import { AlertService } from './alert.service';
import { AlertController } from './alert.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alert, AlertSubscription]),
    AuthModule,
  ],
  controllers: [AlertController],
  providers: [AlertService],
  exports: [AlertService],
})
export class AlertModule {}