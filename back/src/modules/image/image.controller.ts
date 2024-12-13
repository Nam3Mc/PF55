import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody, ApiQuery, ApiParam } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Property } from 'src/entities/property.entity';

@ApiTags('Images')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @ApiOperation({ summary: 'Endpoint to upload an image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload image file',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.uploadPicture(file)
  }

  @Post()
  @ApiOperation({ summary: 'Endpoint to upload an image' })
  savePicture(@Body() PropertyId: string, url: string ) {
    return this.imageService.savePicture(PropertyId, url)

  }

}
