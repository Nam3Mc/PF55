import { Injectable } from '@nestjs/common';
import { AmenitiesDto } from '../../dtos/amenities.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Amenities } from '../../entities/amenitie.entity';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';

@Injectable()
export class AmenitiesService {
  
  constructor(
    @InjectRepository(Amenities)
    private readonly amenitiesDB: Repository<Amenities>
  ) {}

  async setAmenities ( amenities: AmenitiesDto, property: Property) {
    const {wifi, tv, cocina, piscina, parqueadero, airConditioning } = amenities
    const propertyAmenities = new Amenities
    propertyAmenities.airConditioning = airConditioning
    propertyAmenities.tv = tv
    propertyAmenities.cocina = cocina
    propertyAmenities.wifi = wifi
    propertyAmenities.parqueadero = parqueadero
    propertyAmenities.piscina = piscina
    propertyAmenities.property_= property
    await this.amenitiesDB.save(propertyAmenities)
  }

}
