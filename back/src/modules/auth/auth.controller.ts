import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OAuth2Client } from 'google-auth-library';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { GoogleLoginDto } from '../../dtos/google-login.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';

@ApiTags('Authentication') // Etiqueta para Swagger
@Controller('auth')
export class AuthController {
  private googleClient: OAuth2Client;

  constructor(private readonly authService: AuthService) {
    this.googleClient = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  }

  @Post('/signin')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({
    description: 'User credentials for login',
    type: LoginUserDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async signin(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('/google-login')
  @ApiOperation({ summary: 'Login with Google OAuth2 token' })
  @ApiBody({
    description: 'Google OAuth2 token used to authenticate the user',
    type: GoogleLoginDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully authenticated with Google',
    schema: {
      example: {
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImV4YW1wbGVAZ21haWwuY29tIiwibmFtZSI6IkpvaG4gRG9lIiwicGhvdG8iOiJodHRwczovL2V4YW1wbGUuY29tL3Bob3RvLmpwZyIsImV4cCI6MTY4NDU5MjMwMCwiaWF0IjoxNjg0NTg4NzAwfQ.dummy-signature",
        user: {
          id: null,
          name: "John Doe",
          lastName: null,
          email: "example@gmail.com",
          phone: null,
          nationality: null,
          dni: null,
          DOB: null,
          civilStatus: null,
          employmentStatus: null,
          isActive: null,
          photo: "https://example.com/photo.jpg",
          role: "user",
          isRegistered: false
        }
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google token',
  })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    try {
      const { token } = googleLoginDto;
  
      const userResponse = await this.authService.googleLogin(token); // Cambiado: Pasar solo el token
  
      return userResponse;
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }
}
