import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserPhotoDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
