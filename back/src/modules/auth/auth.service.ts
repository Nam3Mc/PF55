import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/login-user.dto';
import { OAuth2Client } from 'google-auth-library';

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
    // Inicializamos el cliente de Google con las credenciales desde el .env
    this.googleClient = new OAuth2Client(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET
    );
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['account_'],
    });

    if (!user || !user.account_ || !(await bcrypt.compare(password, user.account_.password))) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: user.account_.role,
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return {
      token,
      user: {
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
      },
    };
  }

  async googleLogin(googleToken: string) {
    try {
      // Validamos el token con Google
      const ticket = await this.googleClient.verifyIdToken({
        idToken: googleToken,
        audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }

      const { email, name, picture } = payload;

      // Buscamos al usuario en la base de datos
      let user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        // Si no existe, devolvemos un token para un usuario no registrado
        const tempPayload = { email, name, photo: picture };

        const tempToken = this.jwtService.sign(tempPayload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '1h',
        });

        return {
          token: tempToken,
          user: {
            id: null,
            name: name,
            lastName: null,
            email: email,
            phone: null,
            nationality: null,
            dni: null,
            DOB: null,
            civilStatus: null,
            employmentStatus: null,
            isActive: null,
            photo: picture,
            role: 'user',
            isRegistered: false,
          },
        };
      }

      // Si el usuario existe, generamos un token con su información
      const userPayload = {
        id: user.id,
        email: user.email,
        role: user.account_?.role || 'user',
      };

      const token = this.jwtService.sign(userPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.name || name,
          lastName: user.lastName || null,
          email: user.email,
          phone: user.phone || null,
          nationality: user.nationality || null,
          dni: user.dni || null,
          DOB: user.DOB || null,
          civilStatus: user.civilStatus || null,
          employmentStatus: user.employmentStatus || null,
          isActive: user.isActive,
          photo: user.photo || picture,
          role: user.account_?.role || 'user',
          isRegistered: true,
        },
      };
    } catch (error) {
      console.error('Error en la verificación del token:', error);
      throw new UnauthorizedException('Error al validar el token de Google');
    }
  }
}
