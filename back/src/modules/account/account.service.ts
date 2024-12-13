import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {

    constructor( 
        @InjectRepository(Account)
        private readonly accountDB: Repository<Account>
    ) {}

    async findAccountById(id: string): Promise<Account> {
        const account = await this.accountDB.findOne({
            where: {id}
        })
        try {
            if (account) {
                return account
            }
            else {
                throw new NotFoundException("No se encontro ninguna cuenta")
            }
        } catch (error) {
            return error
        }
    }

    async getAllAccounts(): Promise<Account[]> {
        const accounts: Account[] = await this.accountDB.find()
        return accounts
    }

}

