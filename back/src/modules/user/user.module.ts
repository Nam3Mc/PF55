import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account])],
  controllers: [UserController],
  providers: [UserService, NotificationsService],
  exports: [UserService],
})
export class UserModule {}