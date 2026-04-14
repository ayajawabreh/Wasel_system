import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Incident } from './entities/incident.entity';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { AlertModule } from '../alert/alert.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Incident]),
    AlertModule,
    AuthModule,
  ],
  controllers: [IncidentController],
  providers: [IncidentService],
  exports: [IncidentService],
})
export class IncidentModule {}