import { Module } from '@nestjs/common';
import { PreloadController } from './preload.controller';
import { PreloadServices } from './preload.service';
import { PropertyModule } from '../property/property.module';
import { AccountModule } from '../account/account.module';
import { ImageModule } from '../image/image.module';
import { AmenitiesModule } from '../amenities/amenities.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    PropertyModule, 
    AccountModule, 
    ImageModule, 
    AmenitiesModule, 
    UserModule],
  controllers: [PreloadController],
  providers: [PreloadServices],
  exports: [PreloadServices]
})
export class PreloadModule {}
