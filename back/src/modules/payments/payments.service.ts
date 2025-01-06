import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import paypal from '@paypal/checkout-server-sdk'
import axios from 'axios';
import { ContractService } from '../contract/contract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateContractDto } from '../../dtos/create-contract.dto';
import { dayCalculator } from '../../helpers/daysCalculator';
import { PropertyService } from '../property/property.service';
import { AccountService } from '../account/account.service';
import { PaypalService } from '../paypal/paypal.service';
import { ContractStatus } from '../../enums/contract';
import { PaymentDto } from '../../dtos/payment.dto';

@Injectable()
export class PaymentsService {  

  constructor(
    @InjectRepository(Payment)
    private readonly paymentDB: Repository<Payment>,
    private readonly contractDB: ContractService,
    private readonly propertyDB: PropertyService,
    private readonly paypalServices: PaypalService
  ) {}

  async orderAndComission(contractData: CreateContractDto) {
    try {
      const { paypalEmail, startDate, endDate, propertyId} = contractData
      const price = (await this.propertyDB.justProperty(propertyId)).price
      const nights = dayCalculator(new Date(startDate), new Date(endDate))
      const amount = ( (price * nights ) + (price * nights) * 0.04 )
      const commission = ((price * nights) * 0.04 ) * 2
      const paymentData  = this.paypalServices.createOrder(amount, paypalEmail, commission)
      const response = (await paymentData).response
      const status = (await paymentData).status

      if ( status === "CREATED") {
        const contract = await this.contractDB.createContract(contractData)
        return response.result.links[1].href, contract
      }
      else {
        throw new BadRequestException("El pago no se proceso")
      }
    } catch (error) {
      throw new InternalServerErrorException('Error processing order and commission', error.message);
    }
  }

  async captureOrder(paymentData: PaymentDto) {
    try {
      const {url, contractId} = paymentData
      const response = await this.paypalServices.captureOrder(url)
      const id = response.id
      const status = response.status
      const netAmount = response.seller_receivable_breakdown.net_amount.value
      const paymentFee = response.seller_receivable_breakdown.paypal_fee.value
      console.log(netAmount, paymentFee)    
      
      if ( status === "COMPLETED") {
        // const contract = await this.contractDB.getContractById(contractId)
        // contract.status = ContractStatus.ACEPTED
        // contract.startDate = contract.startDate
        // contract.endDate = contract.endDate
        // contract.guests =contract.guests
        // contract.pet = contract.pet
        // contract.minor = contract.minor
        // await this.contractDB.saveContract(contract)
        // const payment = new Payment
        // payment.transactionId = id
        // payment.status = status
        // payment.netAmount = Math.round(netAmount)
        // payment.paymentFee = Math.round(paymentFee)
        // payment.contract_ = contract
        // payment.paymentDate = new Date(Date.now())
        // await this.paymentDB.save(payment)
        // console.log(payment)
        console.log(response)
        return response
      }
    } catch (error) {
      throw new InternalServerErrorException('Error capturing order', error.message);
    }
  }
}
