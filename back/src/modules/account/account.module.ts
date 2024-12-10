import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AccountRepository } from './repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
  ],
  controllers: [AccountController],
  providers: [AccountService, AccountRepository],
  exports: [AccountRepository]
})
export class AccountModule {}
