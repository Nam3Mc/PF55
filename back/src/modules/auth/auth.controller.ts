import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { GoogleLoginDto } from '../../dtos/google-login.dto';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { AuthRepo } from './auth.repo';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly authRepo: AuthRepo
  ) {}

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
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "12345678-1234-5678-1234-567812345678",
          name: "John",
          lastName: "Doe",
          email: "johndoe@example.com",
          phone: "5551234567",
          nationality: "American",
          dni: "00000000",
          DOB: "1990-01-01T00:00:00.000Z",
          civilStatus: "Soltero",
          employmentStatus: "Empleado",
          isActive: true,
          photo: "https://example.com/johndoe.jpg",
          role: "user",
        }        
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid Google token',
  })
  async googleLogin(@Body() googleLoginDto: GoogleLoginDto) {
    return this.authService.googleLogin(googleLoginDto.token);
  }

  @Post("test")
  singIn(@Body() credentials: LoginUserDto) {
    // return credentials
    return this.authRepo.singIn(credentials)
  }


}
