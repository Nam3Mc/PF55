import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(":id")
  create(@Param("id") id: string) {
    return this.accountService.findById( id )
  }
}
