import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AmenitiesService } from './amenities.service';
// import { AmenitiesDto } from '../../dtos/amenities.dto';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Post()
  create(@Body() amenities: any) {
    return this.amenitiesService.setAmenities(amenities);
  }

}
