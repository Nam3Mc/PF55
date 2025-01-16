import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContractService } from '../contract/contract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { Repository } from 'typeorm';
import { CreateContractDto } from '../../dtos/create-contract.dto';
import { dayCalculator } from '../../helpers/daysCalculator';
import { PropertyService } from '../property/property.service';
import { PaypalService } from '../paypal/paypal.service';
import { PaymentDto } from '../../dtos/payment.dto';
import { paymentCreator } from '../../helpers/paymentCreator';
import { reservationCreator } from '../../helpers/reservationCreator';

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
        const property = (await this.propertyDB.justProperty(propertyId))
        const price = property.price
        const nights = dayCalculator(startDate, endDate)
        const amount = ( (price * nights ) + (price * nights) * 0.04 )
        const commission = ((price * nights) * 0.04 ) * 2
        const paymentData  = (await this.paypalServices.createOrder(amount, paypalEmail, commission)).response
        const status = (await this.paypalServices.createOrder(amount, paypalEmail, commission)).status
        if ( status === "CREATED" && price ) {
          const link = (await paymentData).result.links[1].href
          const contract = await this.contractDB.createContract(contractData, property)
          const {id} = contract
          return {link, id}
       }
       else {
        throw new BadRequestException("Las fechas no estan disponibles")
       }
    } catch (error) {
      throw new BadRequestException('Error processing order and commission', error.message);
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
      const contract = await this.contractDB.getContractById(contractId)
      console.log(response)
      if ( status === "COMPLETED") {
        const payment = paymentCreator(id, netAmount, paymentFee, contract)
        const savedPayment = await this.paymentDB.save(payment)
        const updatedContract = await this.contractDB.updateContract(contractId)
        return {savedPayment, updatedContract}
      }
      } catch (error) {
      throw new BadRequestException('Error capturing order', error.message);
     }
  }
}
