import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Property } from '../../entities/property.entity'
import { Repository } from 'typeorm'
import { CreatePropertyDto } from '../../dtos/create-property.dto'
import { AccountService } from '../account/account.service'
import { ImageService } from '../image/image.service'
import { FavoritesDto } from '../../dtos/favorites.dto'
import { UpdatePropertyDto } from '../../dtos/updateProperty.dto'
import { FilterDto } from '../../dtos/filter.dto'
import { propertyCreator } from '../../helpers/createProperty'
import { updateProperty } from '../../helpers/updateProperty'

@Injectable()
export class PropertyService {
  
  constructor( 
    @InjectRepository(Property)
    private readonly propertyDB: Repository<Property>,
    private readonly accountDB: AccountService,
    private readonly imageDB: ImageService,
  ) {}

  async gettingEmail(id: string) {
    try {
      const property = await this.getPropertyById(id)
      const accountId = property[0].account_.id
      const email = (await this.accountDB.findAccountById(accountId)).user_.email
      return email
    } catch (error) {
      throw new InternalServerErrorException('error obteniendo el email');
    }

  }
  
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
        relations: ["account_", "amenities_", "image_"], 
      });
      return properties || [];
    } catch (error) {
      throw new BadRequestException('No has listado ninguna propiedad con esta cuenta');
    }
  }

  async createProperty(propertyData: CreatePropertyDto) {
    try {
      const {
       images, accountId} = propertyData;

      const account = await this.accountDB.findAccountById(accountId);
      if (!account) {
        throw new BadRequestException("Was not possible to add the property to your account");
      }
      const newProperty = propertyCreator(propertyData, account)
      const createdProperty = await this.propertyDB.save(newProperty);
      await this.imageDB.savePicture(createdProperty, images);

      return createdProperty
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
      const properties = await this.getPropertyById(propertyData.id)
      const property = properties[0]
      if (!property) {
        throw new Error('Property not found')
      }
      const propertyUpdated = updateProperty(propertyData, property)
      const updatedProperty = await this.propertyDB.save(propertyUpdated)
      return updatedProperty
    } catch (error) {
      console.error('Error updating property:', error.message)
      throw new Error('Failed to update property')
    }
  }

  async searchProperties(filters: Partial<FilterDto>): Promise<Property[]> {
    const  { capacity, minors, pets, checkIn, checkOut, isActive, country, type } = filters
    try {
      if (checkIn && checkOut) {
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);
        if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
          throw new Error('Las fechas de check-in o check-out no son válidas.');
        }
        if (inDate >= outDate) {
          throw new Error('La fecha de check-in debe ser anterior a la fecha de check-out.');
        }
      }
      const queryBuilder = this.propertyDB.createQueryBuilder('property')
      if (country) {
        queryBuilder.andWhere('property.country = :country', { country })
      }
      if (capacity) {
        queryBuilder.andWhere('property.capacity >= :capacity', { capacity })
      }
      if (type) {
        queryBuilder.andWhere('property.type = :type', { type })
      }
      if (minors !== undefined) {
        queryBuilder.andWhere('property.hasMinor = :minors', { minors })
      }
      if (pets !== undefined) {
        queryBuilder.andWhere('property.pets = :pets', { pets })
      }
      if (isActive !== undefined) {
        queryBuilder.andWhere('property.isActive = :isActive', { isActive })
      }
        return await queryBuilder.getMany();
    } catch (error) {
      console.error('Error al buscar propiedades:', error.message);
      throw new Error('No se pudieron buscar propiedades. Por favor, revise los filtros e intente nuevamente.');
    }
  }

  async changePropertyStatus(id: string) {
    try { 
      const property = await this.justProperty(id)
      if (property.isActive === true) {
        property.isActive = false
      }
      else {
        property.isActive = true
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

}
