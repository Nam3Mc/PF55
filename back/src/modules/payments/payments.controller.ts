import { Body, Controller, Get, Post} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateContractDto } from '../../dtos/create-contract.dto';
import { PaymentDto } from '../../dtos/payment.dto';

@Controller('payments')
export class PaymentsController {

  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Post('paid') 
  @ApiOperation({ summary: 'This end point give you all the details after procesing the payment'})
  paymentData(@Body() paymentData: PaymentDto) {
    return this.paymentsService.captureOrder(paymentData)
  }
  
  @Post()
  @ApiOperation({ summary: 'This endponit rewdirect client to payment page or give the payment page link'})
  payWithComission(@Body() contractData: CreateContractDto) {
    return this.paymentsService.orderAndComission(contractData )
  }

}
