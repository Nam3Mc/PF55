import { IsBoolean, IsUUID } from 'class-validator';

export class AmenitiesDto {

  @IsBoolean()
  wifi: boolean;

  @IsBoolean()
  tv: boolean;

  @IsBoolean()
  airAcconditioning: boolean;

  @IsBoolean()
  piscina: boolean;

  @IsBoolean()
  parqueadero: boolean;

  @IsBoolean()
  kitchen: boolean;
  
}
