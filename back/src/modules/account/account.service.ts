import { Injectable } from '@nestjs/common';
import { AccountRepository } from './account.repository';

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepository: AccountRepository
  ) {}
  
  findById(id: string) {
    return this.accountRepository.getAccountById(id)
  }

  findAll() {
    return `This action returns all account`;
  }
}
