import { Injectable } from '@nestjs/common';
import { CreateModules\authDto } from './dto/create-modules\auth.dto';
import { UpdateModules\authDto } from './dto/update-modules\auth.dto';

@Injectable()
export class Modules\authService {
  create(createModules\authDto: CreateModules\authDto) {
    return 'This action adds a new modules\auth';
  }

  findAll() {
    return `This action returns all modules\auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modules\auth`;
  }

  update(id: number, updateModules\authDto: UpdateModules\authDto) {
    return `This action updates a #${id} modules\auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} modules\auth`;
  }
}
