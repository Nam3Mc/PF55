import { IsString, IsNotEmpty, IsOptional, IsISO8601 } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  recipientId: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsISO8601() // Valida que sea una fecha en formato ISO 8601
  @IsOptional()
  timestamp?: string;
}
