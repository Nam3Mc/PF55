import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../../entities/account.entity';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';

@Injectable()
export class AccountService {

    constructor( 
        @InjectRepository(Account)
        private readonly accountDB: Repository<Account>
    ) {}

    async findAccountById(id: string): Promise<Account> {
        const account = await this.accountDB.findOne({
            where: {id}, 
            relations: ['user_','favorites_']
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

    async createNewAccount(account: Account) {
        return this.accountDB.save(account)
    }

    async addFavorite(accountId: string, property:Property) {
        const account = await this.findAccountById(accountId)
        if (account) {
            account.favorites_.push(property)
            await this.accountDB.save(account)
        }
        else {
            throw new BadRequestException ("No se pudo guardar la propiedad en favoritas")
        }
    }

    async getFavorites(accountId: string) {
        const account = await this.findAccountById(accountId)
        return account.favorites_
    }

}

