import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as streamifier from 'streamifier';

@Injectable()
export class ImageService {
  async uploadPicture(filePath: string, name: string) {
    const uploadResult = await cloudinary.uploader
       .upload(
           filePath, {
               public_id: name,
           }
       )
       .catch((error) => {
           console.log(error);
       });
    
    console.log(uploadResult);
  }
}
