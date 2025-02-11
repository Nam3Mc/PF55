import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Google OAuth2 token used to authenticate the user',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJnb29nbGUtaWRlbnRpdHktYXBpIiwidXNlcl9pZCI6IjEyMzQ1NiIsInN1YiI6IjEyMzQ1NiJ9',
  })
  @IsString()
  token: string;
}
