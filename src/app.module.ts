import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { ReportVoteModule } from './reportVote/report-vote.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'soft2',
      autoLoadEntities: true,
      synchronize: false,
    }),

    UserModule,
    AuthModule,
    ReportModule,
    ReportVoteModule,
  ],
})
export class AppModule {}