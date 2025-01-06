import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { PropertyService } from './property.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { FavoritesDto } from '../../dtos/favorites.dto';
import { UpdatePropertyDto } from '../../dtos/updateProperty.dto';

@ApiTags('Properties')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new property'})
  createProperty(@Body() propertyData: CreatePropertyDto) {
    return this.propertyService.createProperty(propertyData )
  }

  @Post("favorite")
  @ApiOperation({})
  addFavorite(@Body() favoriteData: FavoritesDto) {
    return this.propertyService.addFavorite(favoriteData)
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties'})
  getAllProperties() {
    return this.propertyService.getProperties()
  }

  @Get('type')
  @ApiOperation({summary: 'Get Properties by type'})
  getPropertiesByType(@Body() type: string) {
    return this.propertyService.propertyByType(type)
  }

  @Get('unique/:id')
  @ApiOperation({ summary: 'Get property by ID'})
  getPropertyById(@Param('id') id:string) {
    return this.propertyService.getPropertyById(id)
  }

  @Get('owner/:id')
  @ApiOperation({ summary: 'Get all prperties for an owner'})
  getOwnersProperties(@Param('id') id:string ) {
    return this.propertyService.getOwnersProperties(id)
  }

  @Put("update")
  @ApiOperation({summary: "this end point received a partial fto and update properties"})
  updateProperty(@Body() propertyData: UpdatePropertyDto) {
    return this.propertyService.updateProperty( propertyData)
  }

}
