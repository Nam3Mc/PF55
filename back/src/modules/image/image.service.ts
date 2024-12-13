import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as streamifier from 'streamifier';

@Injectable()
export class ImageService {



  
  async uploadPicture(file: Express.Multer.File): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            reject(new BadRequestException('Failed to upload image to Cloudinary'));
          } else {
            resolve(result.url);
          }
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
