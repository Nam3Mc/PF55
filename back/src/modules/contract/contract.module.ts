import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contract } from '../../entities/contract.entity';
import { AccountModule } from '../account/account.module';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contract]),
    AccountModule,
    PropertyModule
  ],
  controllers: [ContractController],
  providers: [ContractService],
  exports: [ContractService]
})
export class ContractModule {}
