import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  getAllAccoumns() {
    return this.accountService.getAllAccounts()
  }

  @Get(":id")
  getAccountById(@Param("id") id: string) {
    return this.accountService.findAccountById(id)
  }
}
