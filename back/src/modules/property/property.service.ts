import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { AccountService } from '../account/account.service';
import { ImageService } from '../image/image.service';
import { AmenitiesService } from '../amenities/amenities.service';
import { Amenities } from '../../entities/amenitie.entity';


@Injectable()
export class PropertyService {
  
  constructor( 
    @InjectRepository(Property)
    private readonly propertyDB: Repository<Property>,
    private readonly accountDB: AccountService,
    private readonly imageDB: ImageService,
  ) {}

  async getProperties() {
    const properties = await this.propertyDB.find({
      relations: ["image_", "account_", "amenities_"],
    })
    return properties
  }

  async getPropertyById(id: string): Promise<Property[]> {
    const property = await this.propertyDB.find({
      where: { id: id},
      relations: ["account_", "amenities_"]
    });

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
        title, price, images, description, isActive,
        state, city, bedrooms, bathrooms, capacity,
        latitude, longitude, hasMinor, 
        pets, accountId, wifi, cocina, tv, 
        parqueadero, piscina, airConditioning 
      } = propertyData
      const account = await this.accountDB.findAccountById(accountId)

      const amenities = new Amenities
      amenities.airConditioning = airConditioning
      amenities.tv = tv
      amenities.cocina = cocina
      amenities.wifi = wifi
      amenities.parqueadero = parqueadero
      amenities.piscina = piscina

      if (!account) {
        throw new BadRequestException("Was not posible add the property to you account")
      }
      else {
        const newProperty = new Property
        newProperty.name = title
        newProperty.price = price
        newProperty.description = description
        newProperty.state = state
        newProperty.city = city
        newProperty.capacity = capacity
        newProperty.bedrooms = bedrooms
        newProperty.bathrooms = bathrooms
        newProperty.latitude = latitude
        newProperty.longitude = longitude
        newProperty.hasMinor = hasMinor
        newProperty.pets = pets
        newProperty.account_ = account
        newProperty.isActive = isActive
        newProperty.rating = 5
        newProperty.amenities_ = amenities
        const createdProperty = await this.propertyDB.save(newProperty) 
        const propertyPictures = await this.imageDB.savePicture(createdProperty, images)
        return createdProperty
      }
  }

  async createNewProperty(property: Property) {
    return this.propertyDB.save(property)
  }

}
