import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { Modules\authService } from './modules\auth.service';
import { CreateModules\authDto } from './dto/create-modules\auth.dto';
import { UpdateModules\authDto } from './dto/update-modules\auth.dto';

@Controller('modules\auth')
export class Modules\authController {
  constructor(private readonly modules\authService: Modules\authService) {}

  @Post()
  create(@Body() createModules\authDto: CreateModules\authDto) {
    return this.modules\authService.create(createModules\authDto);
  }

  @Get()
  findAll() {
    return this.modules\authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modules\authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModules\authDto: UpdateModules\authDto) {
    return this.modules\authService.update(+id, updateModules\authDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modules\authService.remove(+id);
  }
}
