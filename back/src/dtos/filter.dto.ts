import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class FilterDto {
  @ApiProperty({
    description: 'Debe ser el tipo de propiedad',
    example: 'apartamento',
  })
  @IsString()
  type: string

  @ApiProperty({
    description: 'Debe ser la capacidad',
    example: 4,
  })
  @IsNumber()
  @IsOptional()
  capacity: number

  @ApiProperty({
    description: 'País o ubicación',
    example: 'Argentina',
  })
  @IsString()
  country: string

  @ApiProperty({
    description: 'Fecha de ingreso',
    example: '2025-01-15T14:00:00.000Z',
  })
  @IsString()
  checkIn: string

  @ApiProperty({
    description: 'Fecha de salida',
    example: '2025-01-20T11:00:00.000Z',
  })
  @IsString()
  checkOut: string

  @ApiProperty({
    description: 'Indica si se permiten mascotas',
    example: true,
  })
  @IsBoolean()
  pets: boolean

  @ApiProperty({
    description: 'Indica si se permiten menores',
    example: false,
  })
  @IsBoolean()
  minors: boolean;
}
