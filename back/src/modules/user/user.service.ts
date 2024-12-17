import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from '../../dtos/create-user.dto';
import { UpdateUserDto } from '../../dtos/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Account } from '../../entities/account.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
        name,
        lastName,
        email,
        phone,
        nationality,
        dni,
        DOB,
        civilStatus,
        employmentStatus,
        photo,
        password,
        role,
    } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
        throw new BadRequestException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Filtrar campos vacíos y asignar valores predeterminados si es necesario
    const filteredData = Object.fromEntries(
        Object.entries({
            name,
            lastName,
            email,
            phone: phone || "",
            nationality,
            dni: dni || "",
            DOB,
            civilStatus: civilStatus || "",
            employmentStatus: employmentStatus || "",
            photo: photo || 'https://default.photo.url',
        }).filter(([_, value]) => value !== null && value !== undefined && value !== "")
    );

    const newUser = this.userRepository.create(filteredData);
    const savedUser = await this.userRepository.save(newUser);

    const newAccount = this.accountRepository.create({
        password: hashedPassword,
        role,
        user_: savedUser,
    });

    await this.accountRepository.save(newAccount);

    const userToReturn = await this.userRepository.findOne({
        where: { id: savedUser.id },
        relations: ['account_'],
    });

    if (userToReturn) {
        delete (userToReturn as any).account_.password;
    }

    return userToReturn;
}

async getUsers(page: number, limit: number) {
    const [users, total] = await this.userRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
    });

    if (users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios.');
    }

    return {
        total,
        page,
        limit,
        users,
    };
}

async getUserById(id: string) {
    const user = await this.userRepository.findOne({
        where: { id },
        relations: ['account_'], // Incluye relaciones si es necesario
    });

    if (!user) {
        throw new NotFoundException('Usuario no encontrado.');
    }

    return user;
}

  async updateUserById(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id }, relations: ['account_'] });

    if (!existingUser) {
        throw new NotFoundException('Usuario no encontrado.');
    }

    const {
        name,
        lastName,
        email,
        phone,
        nationality,
        dni,
        DOB,
        civilStatus,
        employmentStatus,
        photo,
        role,
    } = updateUserDto;

    if (
        name ||
        lastName ||
        email ||
        phone ||
        nationality ||
        dni ||
        DOB ||
        civilStatus ||
        employmentStatus ||
        photo
    ) {
        Object.assign(existingUser, {
            name,
            lastName,
            email,
            phone,
            nationality,
            dni,
            DOB,
            civilStatus,
            employmentStatus,
            photo,
        });

        await this.userRepository.save(existingUser);
    }

    const existingAccount = existingUser.account_;
    if (role) {
        existingAccount.role = role;
        await this.accountRepository.save(existingAccount);
    }

    const updatedUser = await this.userRepository.findOne({
        where: { id },
        relations: ['account_'],
    });

    // Eliminar el campo `password` del objeto retornado
    if (updatedUser?.account_) {
        delete updatedUser.account_.password;
    }

    return updatedUser;
  }
  
  async deactivateUser(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    user.isActive = false;
    await this.userRepository.save(user);
    
  }

  
}
