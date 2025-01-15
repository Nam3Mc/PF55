import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { JwtModule } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
import { AuthRepo } from './auth.repo';
import { PropertyService } from '../property/property.service';
import { Property } from '../../entities/property.entity';
import { AccountService } from '../account/account.service';
import { ImageService } from '../image/image.service';
import { Image } from '../../entities/image.entity';
import { ContractService } from '../contract/contract.service';
import { Contract } from '../../entities/contract.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Account, Property, Image, Contract]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, NotificationsService, AuthRepo, PropertyService, AccountService, ImageService, ContractService],
})
export class AuthModule {}
