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
  Delete,
  Patch,
  UseGuards
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { User } from '../../entities/user.entity';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Users')
// @ApiBearerAuth("AuthGuard")
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
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
  @ApiOperation({ summary: 'Get a list of all users' })
  // @UseGuards(AuthGuard)
  async getUsers() {
    return this.userService.getUsers();
  }
  

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  // @UseGuards(AuthGuard)
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
  // @UseGuards(AuthGuard)
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
  // @UseGuards(AuthGuard)
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

  @Patch(':id/activate')
  @ApiOperation({ summary: 'Activate a user by ID' })
  // @UseGuards(AuthGuard)
  @ApiParam({ name: 'id', description: 'UUID of the user', example: '123e4567-e89b-12d3-a456-426614174000' })
  async activateUser(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    try {
      await this.userService.activateUser(id);
      return { message: 'Usuario activado exitosamente' };
    } catch (error) {
      throw new HttpException(
        `Error activating user with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
}

}
