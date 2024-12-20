import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { AccountModule } from '../account/account.module';
import { ImageModule } from '../image/image.module';
import { AmenitiesModule } from '../amenities/amenities.module';

@Module({
  imports: 
  [TypeOrmModule.forFeature([Property]),
  AccountModule,
  ImageModule,
  AmenitiesModule
],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService]
})
export class PropertyModule {}
