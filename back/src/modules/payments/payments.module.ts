import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { ContractModule } from '../contract/contract.module';
import { PropertyModule } from '../property/property.module';
import { AccountModule } from '../account/account.module';
import { PaypalModule } from '../paypal/paypal.module';

@Module({
  imports: [ 
    TypeOrmModule.forFeature([Payment]),
    ContractModule,
    PropertyModule,
    AccountModule,
    PaypalModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [PaymentsService]
})
export class PaymentsModule {}
