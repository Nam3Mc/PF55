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
      userName,
      password,
      role,
    } = createUserDto;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    const existingAccount = await this.accountRepository.findOne({ where: { userName } });

    if (existingUser) {
      throw new BadRequestException('El correo electrónico ya está registrado');
    }

    if (existingAccount) {
      throw new BadRequestException('El nombre de usuario ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.userRepository.create({
      name,
      lastName,
      email,
      phone,
      nationality,
      dni,
      DOB,
      civilStatus,
      employmentStatus,
    });

    const savedUser = await this.userRepository.save(newUser);

    const newAccount = this.accountRepository.create({
      userName,
      password: hashedPassword,
      role,
      user_: savedUser,
    });

    await this.accountRepository.save(newAccount);
    //pendiente ajustar que NO retorne pass
    return this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['account_'],
    });
  }

  async getUsers(page: number, limit: number) {
    const start = (page - 1) * limit;
    const users = await this.userRepository.find({
        skip: start,
        take: limit,
    });

    if (users.length === 0) {
        throw new NotFoundException('No users found.');
    }
    
    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
        throw new NotFoundException('User not found.');
    }

    return user;
  }

  async updateUserById(id: string, updateUserDto: Partial<CreateUserDto>): Promise<User> {
    const existingUser = await this.userRepository.findOne({ where: { id }, relations: ['account_'] });
  
    if (!existingUser) {
      throw new NotFoundException('User not found.');
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
      userName,
      password,
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
      employmentStatus
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
      });
  
      await this.userRepository.save(existingUser);
    }
  
    const existingAccount = existingUser.account_;
    if (userName || password || role) {
      if (userName) {
        const accountWithSameUserName = await this.accountRepository.findOne({ where: { userName } });
        if (accountWithSameUserName && accountWithSameUserName.id !== existingAccount.id) {
          throw new BadRequestException('El nombre de usuario ya está en uso');
        }
        existingAccount.userName = userName;
      }
  
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingAccount.password = hashedPassword;
      }
  
      if (role) {
        existingAccount.role = role;
      }
  
      await this.accountRepository.save(existingAccount);
    }
  
    return this.userRepository.findOne({
      where: { id },
      relations: ['account_'],
    });
  }
  

  
}
