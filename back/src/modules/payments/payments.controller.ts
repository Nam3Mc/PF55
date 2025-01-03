import { Body, Controller, Get} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('payments')
export class PaymentsController {

  constructor(
    private readonly paymentsService: PaymentsService
  ) {}

  @Get('paid') 
  @ApiOperation({ summary: 'This end point give you all the details after procesing the payment'})
  paymentData(@Body() body: {url: string}) {
    return this.paymentsService.captureOrder(body.url)
  }
  
  @Get()
  @ApiOperation({ summary: 'This endponit rewdirect client to payment page or give the payment page link'})
  payWithComission() {
    return this.paymentsService.orderAndComission(450,'sb-hcd34334948799@personal.example.com', 10 )
  }

}
