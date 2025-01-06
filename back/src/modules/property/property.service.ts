import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from '../../entities/property.entity'
import { Repository } from 'typeorm'
import { CreatePropertyDto } from '../../dtos/create-property.dto'
import { AccountService } from '../account/account.service'
import { ImageService } from '../image/image.service'
import { Amenities } from '../../entities/amenitie.entity'
import { FavoritesDto } from '../../dtos/favorites.dto'
import { UpdatePropertyDto } from '../../dtos/updateProperty.dto'
import { TypeOfProperty } from '../../enums/property'

@Injectable()
export class PropertyService {
  
  constructor( 
    @InjectRepository(Property)
    private readonly propertyDB: Repository<Property>,
    private readonly accountDB: AccountService,
    private readonly imageDB: ImageService,
  ) {}
  
  async getProperties() {
    try {
      const properties = await this.propertyDB.find({
        relations: ["image_", "account_", "amenities_"],
      });
      return properties;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching properties');
    }
  }
  
  async getPropertyById(id: string): Promise<Property[]> {
    try {
      const property = await this.propertyDB.find({
        where: { id: id },
        relations: ["account_", "amenities_", "image_"],
      });
      if (!property || property.length === 0) {
        throw new NotFoundException("This property does not exist");
      }
      return property;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching property by ID');
    }
  }

  async justProperty(id: string) {
    try {
      return await this.propertyDB.findOneBy({ id });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching single property');
    }
  }
  
  async getOwnersProperties(id: string): Promise<Property[]> {
    try {
      const properties = await this.propertyDB.find({
        where: { account_: { id } },
      });
      if (!properties || properties.length === 0 || properties === null) {
        throw new NotFoundException("You haven't listed a property yet");
      }
      return properties;
    } catch (error) {
      throw new BadRequestException('No has listado ninguna propiedad con esta cuenta');
    }
  }

  async createProperty(propertyData: CreatePropertyDto) {
    try {
      const {
        title, price, images, description, isActive,
        state, city, bedrooms, bathrooms, capacity,
        latitude, longitude, hasMinor, 
        pets, accountId, wifi, cocina, tv, 
        parqueadero, piscina, airConditioning 
      } = propertyData;

      const account = await this.accountDB.findAccountById(accountId);
      if (!account) {
        throw new BadRequestException("Was not possible to add the property to your account");
      }

      const amenities = new Amenities();
      amenities.airConditioning = airConditioning;
      amenities.tv = tv;
      amenities.cocina = cocina;
      amenities.wifi = wifi;
      amenities.parqueadero = parqueadero;
      amenities.piscina = piscina;

      const newProperty = new Property();
      newProperty.name = title;
      newProperty.price = price;
      newProperty.description = description;
      newProperty.state = state;
      newProperty.city = city;
      newProperty.capacity = capacity;
      newProperty.bedrooms = bedrooms;
      newProperty.bathrooms = bathrooms;
      newProperty.latitude = latitude;
      newProperty.longitude = longitude;
      newProperty.hasMinor = hasMinor;
      newProperty.pets = pets;
      newProperty.account_ = account;
      newProperty.isActive = isActive;
      newProperty.rating = 5;
      newProperty.amenities_ = amenities;

      const createdProperty = await this.propertyDB.save(newProperty);
      await this.imageDB.savePicture(createdProperty, images);

      return createdProperty;
    } catch (error) {
      throw new InternalServerErrorException('Error creating property');
    }
  }

  async createNewProperty(property: Property) {
    try {
      return await this.propertyDB.save(property);
    } catch (error) {
      throw new InternalServerErrorException('Error creating new property');
    }
  }

  async addFavorite(favoriteData: FavoritesDto) {
    try {
      const { accountId, propertyId } = favoriteData;
      const property = await this.justProperty(propertyId);
      if (property) {
        await this.accountDB.addFavorite(accountId, property);
      }
    } catch (error) {
      throw new InternalServerErrorException('Error adding favorite property');
    }
  }

  async updateProperty(propertyData: UpdatePropertyDto) {
    try {
      const { id, title, price, description, state, city, capacity,
              bedrooms, bathrooms, hasMinor, pets, isActive, wifi, 
              piscina, parqueadero, cocina, tv, airConditioning 
            } = propertyData
      const property = await this.getPropertyById(id)[0]
      
      if (!property) {
        throw new Error('Property not found')
      }
  
      property.name = title ?? property.name
      property.price = price ?? property.price
      property.description = description ?? property.description
      property.state = state ?? property.state
      property.city = city ?? property.city
      property.capacity = capacity ?? property.capacity
      property.bedrooms = bedrooms ?? property.bedrooms
      property.bathrooms = bathrooms ?? property.bathrooms
      property.hasMinor = hasMinor ?? property.hasMinor
      property.pets = pets ?? property.pets
      property.isActive = isActive ?? property.isActive
      property.amenities_[1] = wifi ?? property.amenities_[1]
      property.amenities_[2] = tv ?? property.amenities_[2]
      property.amenities_[3] = airConditioning ?? property.amenities_[3]
      property.amenities_[4] = piscina ?? property.amenities_[4]
      property.amenities_[5] = parqueadero ?? property.amenities_[5]
      property.amenities_[6] = cocina ?? property.amenities_[6]
  
      const updatedProperty = await this.propertyDB.save(property)
      return updatedProperty
    } catch (error) {
      console.error('Error updating property:', error.message)
      throw new Error('Failed to update property')
    }
  }

  async propertyByType(type: string): Promise<Property[]> {
    try {
      const properties = await this.propertyDB
        .createQueryBuilder('property')
        .where('property.type = :type', { type })  
        .getMany();
  
      return properties;
    } catch (error) {
      console.error('Error fetching properties by type:', error)
      throw new Error('No se pudieron obtener las propiedades.')
    }
  }
  
}
