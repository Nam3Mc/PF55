import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PropertyService } from './property.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from '../../dtos/create-property.dto';

@ApiTags('Properties')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new property'})
  createProperty(@Body() propertyData: CreatePropertyDto) {
    return this.propertyService.createProperty(propertyData )
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties'})
  getAllProperties() {
    return this.propertyService.getProperties()
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

}
