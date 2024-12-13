import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Query, 
  ParseUUIDPipe, 
  HttpException, 
  HttpStatus, 
  Delete
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { User } from '../../entities/user.entity';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  async createUser(@Body() createUserDto: any): Promise<User> {
     try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      throw new HttpException(
        'Error creating user: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get a list of users with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number', example: 1 })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page', example: 5 })
  async getUsers(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 5;

    return this.userService.getUsers(pageNum, limitNum);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  async getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<User> {
    try {
      return await this.userService.getUserById(id);
    } catch (error) {
      throw new HttpException(
        'User not found with ID: ' + id,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  async updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      return await this.userService.updateUserById(id, updateUserDto);
    } catch (error) {
      throw new HttpException(
        'Error updating user: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a user by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  async deactivateUser(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      await this.userService.deactivateUser(id);
      return { message: 'Usuario desactivado exitosamente' };
    } catch (error) {
      throw new HttpException(
        `Error deactivating user with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
