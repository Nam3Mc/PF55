import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException } from '@nestjs/common';
import * as streamifier from 'streamifier';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entities/image.entity';
import { Repository } from 'typeorm';
import { PropertyService } from '../property/property.service';

@Injectable()
export class ImageService {

  constructor(
    @InjectRepository(Image)
    private readonly imagesDB: Repository<Image>,
    private readonly proertyDB: PropertyService
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

  async savePicture(propertyId: string, url:string ): Promise<Image> {
    const property = await this.proertyDB.getPropertyById(propertyId)
    if (property) {
      const picture = new Image
      picture.property_; property
      picture.url; url
      const newPicture = await this.imagesDB.save(picture)
      return newPicture
    }
    else {
      throw new BadRequestException("Lo sentimos la imagen no pudo ser agregada")
    }
  }

}
