import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { AccountModule } from '../account/account.module';
import { ImageModule } from '../image/image.module';
import { AmenitiesModule } from '../amenities/amenities.module';
import { JwtModule } from '@nestjs/jwt';
import { ContractModule } from '../contract/contract.module';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  imports: 
  [TypeOrmModule.forFeature([Property]),
  AccountModule,
  ImageModule,
  AmenitiesModule,
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
],
  controllers: [PropertyController],
  providers: [PropertyService, NotificationsService],
  exports: [PropertyService]
})
export class PropertyModule {}
