import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PaymentsService } from './payments.service';

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
}
