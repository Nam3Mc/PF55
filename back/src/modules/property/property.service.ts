import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { Repository } from 'typeorm';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { Account } from '../../entities/account.entity';
import { AccountService } from '../account/account.service';
import { ImageService } from '../image/image.service';
import { Image } from '../../entities/image.entity';


@Injectable()
export class PropertyService {
  
  constructor( 
    @InjectRepository(Property)
    private readonly propertyDB: Repository<Property>,
    private readonly accountDB: AccountService,
    private readonly imageDB: ImageService
  ) {}

  async getProperties() {
    const properties = await this.propertyDB.find({
      relations: ["image_"],
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
      const {name, price, images, description, address, hasMinor, pets, accountId } = propertyData
      const account = await this.accountDB.findAccountById(accountId)
      
      if (!account) {
          throw new BadRequestException("Was not posible add the property to you account")
      }
      else {
          const newProperty = new Property
          newProperty.name = name
          newProperty.price = price
          newProperty.description = description
          newProperty.address = address
          newProperty.hasMinor = hasMinor
          newProperty.pets = pets
          newProperty.account_ = account
          const createdProperty = await this.propertyDB.save(newProperty) 
          const propertyPictures = await this.imageDB.savePicture(createdProperty, images)

          return createdProperty
      }
  }

}
