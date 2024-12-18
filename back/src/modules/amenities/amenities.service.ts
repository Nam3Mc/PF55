import { Injectable } from '@nestjs/common';
import { AmenitiesDto } from '../../dtos/amenities.dto';

@Injectable()
export class AmenitiesService {
  constructor(

  ) {}

  async setAmenities ( amenities: AmenitiesDto) {
    console.log(amenities)
    return amenities
  }

}
