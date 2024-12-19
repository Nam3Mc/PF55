import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { AccountService } from '../account/account.service';
import { ImageService } from '../image/image.service';
import { AmenitiesService } from '../amenities/amenities.service';
import { AmenitiesDto } from '../../dtos/amenities.dto';


@Injectable()
export class PropertyService {
  
  constructor( 
    @InjectRepository(Property)
    private readonly propertyDB: Repository<Property>,
    private readonly accountDB: AccountService,
    private readonly imageDB: ImageService,
    private readonly amenitiesDB: AmenitiesService
  ) {}

  async getProperties() {
    const properties = await this.propertyDB.find({
      relations: ["image_", "account_"],
    })
    return properties
  }

  async getPropertyById(id: string): Promise<Property> {
    const property = await this.propertyDB.findOneBy({ id });
    if (!property) {
        throw new NotFoundException("This property does not exist");
    }
    console.log(property);
    return property;
  }

  async getOwnersProperties(id: string): Promise<Property[]>  {
      const properties = await this.propertyDB.find({
          where: {account_: {id}}
      })
      if (!properties) {
          throw new NotFoundException("You haven't listed a property yet")
      }
      else {
          return properties
      }
  }

  async createProperty(propertyData: CreatePropertyDto) {
      const {
        titel, 
        price, 
        images, 
        description, 
        state, 
        city, 
        bedrooms, 
        bathrooms, 
        latitude, 
        longitude, 
        hasMinor, 
        pets, 
        accountId, 
        wifi, 
        kitchen, 
        tv, 
        parqueadero, 
        piscina, 
        airAcconditioning } = propertyData
      const account = await this.accountDB.findAccountById(accountId)

      const amenities = new AmenitiesDto
      amenities.airAcconditioning = airAcconditioning
      amenities.tv = tv
      amenities.kitchen = kitchen
      amenities.wifi = wifi
      amenities.parqueadero = parqueadero
      amenities.piscina = piscina

      if (!account) {
        throw new BadRequestException("Was not posible add the property to you account")
      }
      else {
        const newProperty = new Property
        newProperty.name = titel
        newProperty.price = price
        newProperty.description = description
        newProperty.state = state
        newProperty.city = city
        newProperty.bedrooms = bedrooms
        newProperty.bathrooms = bathrooms
        newProperty.latitude = latitude
        newProperty.longitude = longitude
        newProperty.hasMinor = hasMinor
        newProperty.pets = pets
        newProperty.account_ = account
        const createdProperty = await this.propertyDB.save(newProperty) 
        const propertyPictures = await this.imageDB.savePicture(createdProperty, images)
        const propertyAmenities = await this.amenitiesDB.setAmenities(amenities, createdProperty)
        return createdProperty
      }
  }

  async createNewProperty(property: Property) {
    return this.propertyDB.save(property)
  }

}
