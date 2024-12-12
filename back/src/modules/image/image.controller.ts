import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
import { CreatePropertyDto } from '../../dtos/create-property.dto';
import { FileInterceptor } from '@nestjs/platform-express';


@ApiTags('Images')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'endpoint to upload an imimage'})
  @UseInterceptors(FileInterceptor('file'))
  async create(@UploadedFile() file: Express.Multer.File) {
    const image = await  cloudinary.uploader.upload(file.path)
    console.log(file)
    // console.log(imagePath)
  }
  
}
