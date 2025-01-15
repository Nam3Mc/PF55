import { Controller, Get, Post, Body, Param, Put, Query, UseGuards, Delete, Req } from '@nestjs/common';
import { PropertyService } from './property.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { FavoritesDto } from '../../dtos/favorites.dto';
import { UpdatePropertyDto } from '../../dtos/updateProperty.dto';
import { FilterDto } from '../../dtos/filter.dto';
import { IdDto } from '../../dtos/id.dto';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Properties')
@ApiBearerAuth("AuthGuard")
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
  @ApiOperation({ summary: 'Get all activated properties'})
  getAllProperties() {
    return this.propertyService.getProperties()
  }

  @Get("all")
  @ApiOperation({ summary: "get all properties endpoint for admin"})
  @UseGuards(AuthGuard)
  getProperties(@Req() request: Express.Request) {
    // console.log(request)
    return this.propertyService.getAllProperties()
  }
  
  @Get("email/:id")
  @ApiOperation({summary: "devuelve el email de la cuenta relacionado con la propiedad para paypal y recibe el id"})
  getEmail(@Param('id') id: string) {
    return this.propertyService.gettingEmail(id)
  }

  @Get('filter')
  @ApiOperation({summary: 'Get Properties by type'})
  @ApiQuery({ name: 'type', required: false, description: 'Type of the property', type: String})
  @ApiQuery({ name: 'capacity', required: false, description: 'Capacity of the property', type: Number })
  @ApiQuery({ name: 'country', required: false, description: 'Capacity of the property', type: String})
  @ApiQuery({ name: 'checkOut', required: false, description: 'Capacity of the property', type: String})
  @ApiQuery({ name: 'checkIn', required: false, description: 'Capacity of the property', type: String})
  @ApiQuery({ name: 'pets', required: false, description: 'Capacity of the property', type: Boolean })
  @ApiQuery({ name: 'minors', required: false, description: 'Capacity of the property', type: Boolean })
  getPropertiesByType(@Query() filter: Partial<FilterDto>) {
    return this.propertyService.searchProperties(filter)
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

  @Put()
  @ApiOperation({summary: "this end point received a partial fto and update properties"})
  updateProperty(@Body() propertyData: UpdatePropertyDto) {
    return this.propertyService.updateProperty( propertyData)
  }

  @Put("status")
  @ApiOperation({ summary: "This endpoint changes the property status" })
  changePropertyStatus(@Body() id:IdDto) {
    return this.propertyService.changePropertyStatus(id);
  }

  @Delete()
  @ApiOperation({ summary: "Endpoint to delete a property"})
  deleteProperty(@Param('id') id: string) {
    return this.propertyService.deleteProperty(id) 
  }
   
  
}
