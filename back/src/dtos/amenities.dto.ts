import { IsBoolean, IsUUID } from 'class-validator';

export class AmenitiesDto {

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  tv: boolean;

  @IsBoolean()
  airConditioning: boolean;

  @IsBoolean()
  piscina: boolean;

  @IsBoolean()
  parqueadero: boolean;

  @IsBoolean()
  cocina: boolean;
  
}
