import { Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateContractDto } from '../../dtos/create-contract.dto';
import { PaymentDto } from '../../dtos/payment.dto';
import { AuthGuard } from '../../guards/auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {

  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Post('paid') 
  // @ApiBearerAuth('AuthGuard')
  @ApiOperation({ summary: 'This end point give you all the details after procesing the payment'})
  // @UseGuards(AuthGuard)
  paymentData(@Body() paymentData: PaymentDto) {
    return this.paymentsService.captureOrder(paymentData)
  }
  
  @Post()
  @ApiOperation({ summary: 'This endponit rewdirect client to payment page or give the payment page link'})
  // @UseGuards(AuthGuard)
  payWithComission(@Body() contractData: CreateContractDto) {
    return this.paymentsService.orderAndComission(contractData )
  }

}
