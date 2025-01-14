import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, NotificationsService],
})
export class AuthModule {}
