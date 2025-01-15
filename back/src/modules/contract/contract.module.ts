import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    AccountModule
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService]
})
export class ContractModule {}
