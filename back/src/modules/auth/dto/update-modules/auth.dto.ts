import { PartialType } from '@nestjs/swagger';
import { CreateModules\authDto } from './create-modules\auth.dto';

export class UpdateModules\authDto extends PartialType(CreateModules\authDto) {}
