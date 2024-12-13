import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as streamifier from 'streamifier';

@Injectable()
export class ImageService {
  async uploadPicture(file: Express.Multer.File) {
    // if (!file || !file.buffer) {
      // throw new BadRequestException('No file provided or file buffer is missing');
    // }

    // return new Promise((resolve, reject) => {
      // const uploadStream = cloudinary.uploader.upload_stream(
        // { folder: 'uploads' }, // Carpeta en Cloudinary
        // (error, result) => {
          // if (error) return reject(error);
          // resolve(result);
        // },
      // );

      // streamifier.createReadStream(file.buffer).pipe(uploadStream);
    // });
  }
}
