import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentOrderDto } from '../../dtos/paymentOrder.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService
  ) {}
  
  @Get()
  getToken() {
    return this.paymentsService.newPayment()
  }

  @Get('paid') 
  paymentData() {
    return this.paymentsService.captureOrder()
  }
  
  @Get('order')
  payWithComission() {
    return this.paymentsService.orderAndComission(450,'sb-047gso34940525@business.example.com', 10 )
  }
}
