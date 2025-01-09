import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  UploadedFile, 
  UseInterceptors, 
  BadRequestException, 
  Delete
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiOperation, ApiTags, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserPhotoDto } from '../../dtos/update-photo-user.dto';

const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
    return callback(new BadRequestException('Only image files (jpg, jpeg, png, gif) are allowed!'), false);
  }
  callback(null, true);
};
const maxFileSize = 1 * 1024 * 1024; // 1 MB

@ApiTags('Images')
@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get()
  @ApiOperation({ summary: 'Get all pictures' })
  getPictures() {
    return this.imageService.getAllPictures();
  }

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
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: maxFileSize },
      fileFilter: imageFileFilter,
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.imageService.uploadPicture(file);
  }

  @Post('/user-photo')
  @ApiOperation({ summary: 'Upload a photo for a user' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload user photo',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: maxFileSize },
      fileFilter: imageFileFilter,
    }),
  )
  async uploadUserPhoto(
    @UploadedFile() file: Express.Multer.File,
    @Body() updatePhotoDto: UpdateUserPhotoDto,
  ) {
    return this.imageService.uploadUserPhoto(file, updatePhotoDto.id);
  }

  @Delete()
  @ApiOperation({summary: "picture id to delete"})
  deletePicture(@Body() id: UpdateUserPhotoDto) {
    return this.imageService.deleteImage(id)
  }

}
