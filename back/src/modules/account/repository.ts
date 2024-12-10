import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { Account } from "src/entities/account.entity";
import { CreateAccountDto } from "src/dtos/create-account.dto";
import { AuthDto } from "src/dtos/auth.dto";

@Injectable()
export class AccountRepository{
    constructor(
        @InjectRepository(Account)
        private readonly accountDB: Repository<Account>,
        private readonly jwtService: JwtService,
    ){}

    async validateAccount(userName: string): Promise<boolean> {
        const existAccount = await this.accountDB.findOne({ where: {userName} })
        if (existAccount) {
            return true
        }
        else {
            return false
        }
    }

    async createAccount(accountData: CreateAccountDto): Promise<Account> {
        const {userName, password, roll} = accountData
        const hashedPassword = await bcrypt.hash(password, 10)
        const newAccount = new Account
        newAccount.userName = userName
        newAccount.password = hashedPassword
        newAccount.roll = roll
        const createdAccount = await this.accountDB.save(newAccount)
        return createdAccount
    }

    async getAccountById(id: string): Promise<Account> {
        const account = await this.accountDB.findOne({ 
            where: {id},
            relations: ["user_"]
        })
        if (!account) {
            throw new BadRequestException("This is not a valid account")
        }
        else {
            return account
        }
    }
 
    async validateCredentials(authData: AuthDto): Promise<{token: string, id: string, roll: string}> {
        const {userName, password } = authData
        const validateAccount = this.validateAccount(userName)
        try {            
            if (validateAccount) {
                const account = await this.accountDB.findOne({ where: { userName }})
                const roll = account.roll
                const id = account.id
                const accountPassword = account.password
                const isPasswordValid = await bcrypt.compare(password, accountPassword)
                if (isPasswordValid) {
                    const userPayload = {
                        sub: account.id,
                        id: account.id,
                        userName: account.userName
                    }
                    const token = this.jwtService.sign(userPayload)
                    return {token, id, roll}
                }
                else {
                    throw new BadRequestException("Password or User Name incorrect please verify the information")
                }
            }
            else {
                throw new BadRequestException("Password or User Name incorrect please verify the information")  
            } 
            }
        catch (error) {
            throw new BadRequestException("Password or User Name incorrect please verify the information")  
        }
    }
}