import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { ReportVoteModule } from './reportVote/report-vote.module';
import { CheckpointModule } from './checkpoint/checkpoint.module';
import { IncidentModule } from './incident/incident.module';
import { RouteModule } from './route/route.module';

// 🔔 Alerts modules (new)
import { AlertModule } from './alert/alert.module';
import { AlertSubscriptionModule } from './alert-subscription/alert-subscription.module';

@Module({
  imports: [
    // 🌱 Config Module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // 🗄️ Database (Async Config)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') ?? '3306'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),

    // 🚦 Rate Limiting (Throttler)
    ThrottlerModule.forRoot([
      {
        ttl: 60_000,
        limit: 500,
      },
    ]),

    // 📦 Feature Modules
    UserModule,
    AuthModule,
    ReportModule,
    ReportVoteModule,
    CheckpointModule,
    IncidentModule,
    RouteModule,

    // 🔔 Alerts (new)
    AlertModule,
    AlertSubscriptionModule,
  ],

  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}