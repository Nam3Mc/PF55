import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  create(@Body() createImageDto: any) {
    return createImageDto
  }
  
}