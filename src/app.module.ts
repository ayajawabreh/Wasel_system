import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
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
