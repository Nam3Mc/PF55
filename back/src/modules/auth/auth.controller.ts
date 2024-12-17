import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { OAuth2Client } from 'google-auth-library';

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
  async googleLogin(@Body('token') token: string) {
    try {
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
