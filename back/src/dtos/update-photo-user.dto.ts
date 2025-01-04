import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateUserPhotoDto {
  @ApiProperty({ example: "fd56f94f-2a1b-4819-adda-63ed86fda855", description: "image ID"})
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
