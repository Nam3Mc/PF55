import { v2 as cloudinary } from 'cloudinary';
import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as streamifier from 'streamifier';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from '../../entities/image.entity';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { User } from '../../entities/user.entity';
import { UpdateUserPhotoDto } from '../../dtos/update-photo-user.dto';

@Injectable()
export class ImageService {
  
  constructor(
    @InjectRepository(Image)
    private readonly imagesDB: Repository<Image>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getAllPictures() {
    try {
      const pictures = await this.imagesDB.find();
      return pictures;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve pictures');
    }
  }

  async getPropertyPictures(property: Property): Promise<Image[]> {
    try {
      const pictures = await this.imagesDB.find({
        where: { property_: property },
      });
      return pictures;
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve property pictures');
    }
  }

  async uploadPicture(file: Express.Multer.File): Promise<any> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Unexpected error during image upload');
    }
  }

  async savePicture(property: Property, urls: string[]): Promise<Image[]> {
    try {
      for (const link of urls) {
        const picture = new Image();
        picture.property_ = property;
        picture.url = link;
        await this.imagesDB.save(picture);
      }
      const images: Image[] = await this.getPropertyPictures(property);
      return images;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save property pictures');
    }
  }

  async uploadUserPhoto(file: Express.Multer.File, id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: 'users' },
          (error, result) => {
            if (error) {
              reject(new BadRequestException('Failed to upload user photo to Cloudinary'));
            } else {
              resolve(result);
            }
          },
        );

        streamifier.createReadStream(file.buffer).pipe(uploadStream);
      });

      user.photo = (uploadResult as any).secure_url;
      await this.userRepository.save(user);

      return { message: 'User photo updated successfully', photoUrl: user.photo };
    } catch (error) {
      throw new InternalServerErrorException('Failed to upload or save user photo');
    }
  }

  async deleteImage(object: UpdateUserPhotoDto) {
    try {
      const { id } = object;
      const image = await this.imagesDB.findOneBy({ id });
      if (!image) {
        throw new NotFoundException('Image not found');
      }
      await this.imagesDB.delete(image);
      return 'Image deleted successfully';
    } catch (error) {
      throw new InternalServerErrorException('Failed to delete image');
    }
  }
}
