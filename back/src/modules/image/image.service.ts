import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v2 as cloudinary } from 'cloudinary';


@Injectable()
export class ImageService {

  constructor(
    // @InjectRepository(Image)
    // private readonly imageDB: Repository<Image>
  ) {}

  uploadPicture() {

  }


}
