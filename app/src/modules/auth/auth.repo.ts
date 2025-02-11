import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { Account } from "../../entities/account.entity";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { LoginUserDto } from "../../dtos/login-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable() 
export class AuthRepo {
    constructor(
        @InjectRepository(User)
        private readonly userDB: Repository<User>,
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
        private readonly jwtService: JwtService
    ) {}

    async singIn(credentials: LoginUserDto) {
        const { email, password } = credentials
        const user = await this.userDB.findOne({
            where: { email },
            relations: ['account_'],
        })
        if (user) {
            const isValidPassword = await await bcrypt.compare(password, user.account_.password)
           if (isValidPassword) {
                const userPpayLoad = {
                    sub: user.id,
                    id: user.id,
                    email: user.email
                }
                const token = this.jwtService.sign(userPpayLoad)



               return { success: 'usuario logueado correctamente', token}
            }
            throw new BadRequestException("No se pudo loguear el usuario password")
        }
        throw new BadRequestException("No se pudo loguear el usuario")
    }
}