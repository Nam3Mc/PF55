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
// @ApiBearerAuth("AuthGuard")
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @ApiOperation({ summary: 'Create new property'})
  createProperty(@Body() propertyData: CreatePropertyDto) {
    return this.propertyService.createProperty(propertyData )
  }

  @Post("favorite")
  @ApiOperation({ summary: 'Favorites properties for an account'})
  // @UseGuards(AuthGuard)
  addFavorite(
    @Req() request: Express.Request,
    @Body() favoriteData: FavoritesDto) {
    return this.propertyService.addFavorite(favoriteData)
  }

  @Get()
  @ApiOperation({ summary: 'Get all activated properties'})
  getAllProperties() {
    return this.propertyService.getProperties()
  }

  @Get("all")
  @ApiOperation({ summary: "get all properties endpoint for admin"})
  // @UseGuards(AuthGuard)
  getProperties(@Req() request: Express.Request) {
    return this.propertyService.getAllProperties()
  }
  
  @Get("email/:id")
  @ApiOperation({summary: "devuelve el email de la cuenta relacionado con la propiedad para paypal y recibe el id"})
  // @UseGuards(AuthGuard)
  getEmail(
    @Req() request: Express.Request,
    @Param('id') id: string) {
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
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all properties for an owner'})
  getOwnersProperties(
    @Req() request: Express.Request,
    @Param('id') id:string ) {
    return this.propertyService.getOwnersProperties(id)
  }

  @Put()
  // @UseGuards(AuthGuard)
  @ApiOperation({summary: "this end point received a partial fto and update properties"})
  updateProperty(
    @Req() request: Express.Request,
    @Body() propertyData: UpdatePropertyDto) {
    return this.propertyService.updateProperty( propertyData)
  }

  @Put("status")
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: "This endpoint changes the property status" })
  changePropertyStatus(
    @Req() request: Express.Request,
    @Body() id:IdDto) {
    return this.propertyService.changePropertyStatus(id);
  }

  @Delete()
  // @UseGuards(AuthGuard)
  @ApiOperation({ summary: "Endpoint to delete a property"})
  deleteProperty(
    @Req() request: Express.Request,
    @Param('id') id: string) {
    return this.propertyService.deleteProperty(id) 
  }
   
  
}
