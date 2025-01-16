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
import { PropertyStatus } from '../../enums/property'
import { IdDto } from '../../dtos/id.dto'
import { Contract } from '../../entities/contract.entity'
import { normalizeString } from '../../helpers/wordsConverter'

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

  async getOwner(id: string) {
    try {
      const property = await this.getPropertyById(id)
      const accountId = property[0].account_.id
      const userId = (await this.accountDB.findAccountById(accountId)).user_.id
      return userId
    } catch (error) {
      throw new InternalServerErrorException('error obteniendo el email');
    }
  }
  
  async getProperties() {
    try {
      const properties = await this.propertyDB.find({
        where: {isActive: PropertyStatus.ACTIVATED },
        relations: ["image_", "account_", "amenities_"],
      });
      return properties;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching properties');
    }
  }

  async getAllProperties() {
    try {
      const properties = await this.propertyDB.find({
        relations: ["image_", "account_", "amenities_"]
      })
      return properties
    } catch (error) {
      console.log(error)
      return []
    }
  }
  
  async getPropertyById(id: string): Promise<Property[]> {
    try {
      const property = await this.propertyDB.find({
        where: { id: id },
        relations: ["account_", "amenities_", "image_", 'contract_'],
      });
      if (!property || property.length === 0) {
        throw new NotFoundException("This property does not exist");
      }
      return property;
    } catch (error) {
      throw new BadRequestException('Error fetching property by ID');
    }
  }

  async justProperty(id: string) {
    try {
      return await this.propertyDB.findOneBy({ id });
    } catch (error) {
      throw new BadRequestException('Error fetching single property');
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
      throw new BadRequestException('Error creating property');
    }
  }

  async createNewProperty(property: Property) {
    try {
      return await this.propertyDB.save(property);
    } catch (error) {
      throw new BadRequestException('Error creating new property');
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
      throw new BadRequestException('Error adding favorite property');
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
  
  async changePropertyStatus(id: IdDto) {
    try { 
      const property = await this.justProperty(id.id)
      if (property.isActive === "pendiente" || property.isActive === "inactiva") {
        property.isActive = PropertyStatus.ACTIVATED
        const updatedProperty = await this.propertyDB.save(property)
        return updatedProperty
      }
      else {
        property.isActive = PropertyStatus.INACTIVE
        const updatedProperty = await this.propertyDB.save(property)
        return updatedProperty
      }
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  async deleteProperty( id: string) {
    try {
      await this.propertyDB.delete(id)
      return "La propidad fue eliminada exitosamente"      
    } catch (error) {
      throw new BadRequestException("Ocurrio un error al eliminar la propiedad")
    }
  }

  async searchProperties(filter: Partial<FilterDto>) {
    try {
      const { checkIn, checkOut, minors, pets, country, capacity, type } = filter  
      
      const allProperties = this.propertyDB
      .createQueryBuilder('property')
      .leftJoinAndSelect('property.image_', 'image')
      .leftJoinAndSelect('property.amenities_', 'amenities')
      .where('property.isActive = :activa', {activa: 'activa'})
      
      if (checkIn && checkOut) {
        const inDay = new Date(checkIn)
        const outDay = new Date(checkOut)
        const dataFilter = await allProperties
          .andWhere((qb) => {
            const subQuery = qb
              .subQuery()
              .select('1') 
              .from(Contract, 'contract')
              .where('contract.property_ = property.id') 
              .andWhere('contract.startDate < :outDay', { outDay }) 
              .andWhere('contract.endDate > :inDay', { inDay }) 
              .andWhere('contract.status = :aceptado', { aceptado: 'aceptado' })
              .getQuery(); 
              return `NOT EXISTS (${subQuery})`
            })
          }
          if (country) {
            const countryS = normalizeString(country)
            allProperties.andWhere('property.country = :country', {country: countryS})
          }
          if (capacity) {
            allProperties.andWhere('property.capacity >= :capacity', { capacity })
          }
          if (type) {
            const typeS = normalizeString(type)
            allProperties.andWhere('property.type = :type', { type: typeS })
          }
          if (pets !== undefined) {
            allProperties.andWhere('property.petsAllowed = :pets', { pets })
          }
          if (minors !== undefined) {
            allProperties.andWhere('property.minorsAllowed = :minors', { minors })
          }  
        const filteredProperties = await allProperties.getMany()
        return filteredProperties
      }
      catch (error) {
      console.error(error)
      return []
    }
  }

}
