import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { PropertyModule } from '../property/property.module';
import { PropertyService } from '../property/property.service';
import { Property } from '../../entities/property.entity';
import { AccountService } from '../account/account.service';
import { ImageService } from '../image/image.service';
import { ContractService } from '../contract/contract.service';
import { Image } from '../../entities/image.entity';
import { Contract } from '../../entities/contract.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Account, Property, Image, Contract]),
  PropertyModule
  ],
  controllers: [UserController],
  providers: [UserService, NotificationsService, PropertyService, AccountService, ImageService, ContractService],
  exports: [UserService],
})
export class UserModule {}