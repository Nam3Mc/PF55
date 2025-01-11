import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { OAuth2Client } from 'google-auth-library';
import { Role } from '../../enums/account';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {
    this.googleClient = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    );
  }

  private generateJwtToken(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.account_.role,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });
  }

  private formatUserResponse(user: User) {
    return {
      id: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      nationality: user.nationality,
      dni: user.dni,
      DOB: user.DOB,
      civilStatus: user.civilStatus,
      employmentStatus: user.employmentStatus,
      isActive: user.isActive,
      photo: user.photo,
      role: user.account_.role,
    };
  }

  async createUser(createUserDto: CreateUserDto) {
    const {
      name = 'Unknown',
      lastName = 'Unknown',
      email,
      phone = null,
      nationality = 'Not specified',
      dni = null,
      DOB,
      civilStatus = null,
      employmentStatus = null,
      isActive = true,
      photo = null,
      password = null,
      role = Role.USER,
    } = createUserDto;

    // Verificar si el email ya existe en la base de datos
    const existingUser = await this.userRepository.findOne({
      where: { email },
      relations: ['account_'],
    });

    if (existingUser) {
      throw new UnauthorizedException('User with this email already exists');
    }

    // Crear cuenta
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const account = this.accountRepository.create({
      role,
      password: hashedPassword,
    });

    // Guardar la cuenta primero
    await this.accountRepository.save(account);

    // Crear el usuario
    const user = this.userRepository.create({
      name,
      lastName,
      email,
      phone,
      nationality,
      dni,
      DOB,
      civilStatus,
      employmentStatus,
      isActive,
      photo,
      account_: account, // Asociamos la cuenta con el usuario
    });

    // Guardar el usuario
    await this.userRepository.save(user);

    return {
      message: 'User created successfully',
      user: this.formatUserResponse(user),
    };
  }

  async googleLogin(token: string) {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('Invalid Google token payload');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
        relations: ['account_'],
      });

      if (existingUser) {
        const token = this.generateJwtToken(existingUser);
        return {
          token,
          user: this.formatUserResponse(existingUser),
        };
      }

      const createUserDto: CreateUserDto = {
        name: payload.given_name || 'Unknown',
        lastName: payload.family_name || 'Unknown',
        email: payload.email,
        photo: payload.picture || null,
        DOB: new Date('2000-01-01'), // Default DOB
        nationality: 'Not specified',
        role: Role.USER,
        password: null, // Google login doesn't require a password
      };

      return await this.createUser(createUserDto);
    } catch (error) {
      console.error('Error verifying Google token:', error);
      throw new UnauthorizedException('Invalid Google token');
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['account_'],
    });

    if (!user || !user.account_ || !(await bcrypt.compare(password, user.account_.password))) {
      throw new UnauthorizedException('Incorrect credentials');
    }

    const token = this.generateJwtToken(user);
    return {
      token,
      user: this.formatUserResponse(user),
    };
  }
}
