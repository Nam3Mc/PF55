import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';

@Controller('account')
@ApiBearerAuth('AuthGuard')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  @ApiOperation({ summary: 'An admin can check all accounts'})
  // @UseGuards(AuthGuard)
  getAllAccoumns() {
    return this.accountService.getAllAccounts()
  }

  @Get('favorites/:id')
  @ApiOperation({ summary: 'favorites properties for an account '})
  // @UseGuards(AuthGuard)
  getFavorites(@Param("id") id: string) {
    return this.accountService.getFavorites(id)
  }

  @Get("user/:id")
  @ApiOperation({ summary: 'you can have just one specific account'})
  getAccountById(@Param("id") id: string) {
    return this.accountService.findAccountById(id)
  }

}
