import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module'; 
import { JwtAuthGuard } from './jwt-auth';


@Module({
  imports: [
    UserModule, 
    JwtModule.register({
      secret: '123456789',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [AuthService, JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard, JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
