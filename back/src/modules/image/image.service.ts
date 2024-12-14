import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as streamifier from 'streamifier';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entities/image.entity';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';

@Injectable()
export class ImageService {

  constructor(
    @InjectRepository(Image)
    private readonly imagesDB: Repository<Image>,
  ) {}

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

  async savePicture(property: Property, url:string ): Promise<Image> {
      const picture = new Image
      picture.property_; property
      picture.url; url
      const newPicture = await this.imagesDB.save(picture)
      return newPicture
  }

}
