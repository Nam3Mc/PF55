import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Account } from '../../entities/account.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../../dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly jwtService: JwtService,
  ) {}

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
        email: user.email,
        roles: user.account_.role,
        isActive: user.isActive,
      },
    };
  }

  /**
   * Maneja el inicio de sesión con Google.
   */
  async googleLogin(googleUser: { email: string; name: string; photo: string }) {
    const { email, name, photo } = googleUser;

    // Busca el usuario en la base de datos por email
    let user = await this.userRepository.findOne({ where: { email } });

    // Si no existe el usuario, permite acceso temporal sin registrar en la base de datos
    if (!user) {
      // Puedes decidir registrar un usuario temporal en memoria o simplemente generar un token
      const payload = { email, name, photo };

      const token = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      });

      return {
        token,
        user: {
          email,
          name,
          photo,
          isRegistered: false, // Indica que el usuario no está registrado en la base de datos
        },
      };
    }

    // Si el usuario existe, genera un token JWT
    const payload = {
      id: user.id,
      email: user.email,
      role: user.account_?.role || 'user', // Rol si existe
    };

    const token = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || name, // Usa el nombre almacenado o el proporcionado por Google
        photo: user.photo || photo, // Usa la foto almacenada o la proporcionada por Google
        roles: user.account_?.role || 'user',
        isActive: user.isActive,
        isRegistered: true, // Indica que está registrado en la base de datos
      },
    };
  }
}
