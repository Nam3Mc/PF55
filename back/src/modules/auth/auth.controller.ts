import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { GoogleLoginDto } from '../../dtos/google-login.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(private readonly authService: AuthService) {
    this.googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }

  @Post('/signin')
  async signin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/google-login')
  @ApiOperation({ summary: 'Login with Google token' })
  @ApiBody({
    description: 'Google OAuth2 token used to authenticate the user',
    type: GoogleLoginDto, // Utiliza el DTO para definir el cuerpo
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            name: { type: 'string' },
            photo: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google token',
  })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) { // Cambia para recibir el DTO completo
    try {
      const { token } = googleLoginDto; // Extraemos el token del DTO

      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token');
      }

      const { email, name, picture } = payload;

      const userResponse = await this.authService.googleLogin({
        email,
        name,
        photo: picture,
      });

      return userResponse;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
