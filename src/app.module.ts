import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { ReportVoteModule } from './reportVote/report-vote.module';
import { AlertSubscriptionModule } from './alert-subscription/alert-subscription.module';
import { AlertModule } from './alert/alert.module';
import { IncidentModule } from './incident/incident.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'advance_soft',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    }),

    UserModule,
    AuthModule,
    ReportModule,
    ReportVoteModule,
    AlertSubscriptionModule,
    AlertModule,
    IncidentModule,
  ],
})
export class AppModule {}
=======
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RouteController } from './route.controller';
import { RouteService } from './route.service';
import { Checkpoint } from '../checkpoint/entities/checkpoint.entity';
import { Incident } from '../incident/entities/incident.entity';
import { Area } from '../area/entities/area.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkpoint, Incident, Area]),
    HttpModule,
    CacheModule.register({
      ttl: 15 * 60 * 1000,
      max: 100,
      isGlobal: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 10,
      },
    ]),
  ],
  controllers: [RouteController],
  providers: [
    RouteService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class RouteModule {}
>>>>>>> aya2
