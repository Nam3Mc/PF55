import { Injectable, InternalServerErrorException } from '@nestjs/common';
import paypal from '@paypal/checkout-server-sdk'
import axios from 'axios';
import { ContractService } from '../contract/contract.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {  
  private environment: paypal.core.SandboxEnvironment
  private client: paypal.core.PayPalHttpClient
  private readonly PAYPAL_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'

  constructor(
    @InjectRepository(Payment)
    private readonly paymentDB: Repository<Payment>,
    private readonly contractDB: ContractService

  ) {
      this.environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET 
      )
      this.client = new paypal.core.PayPalHttpClient(this.environment)
   }

  async captureOrder(code: string): Promise<any> {
    try {
      const url = new URL(code);
      const orderId = url.searchParams.get('token');

      if (!orderId) {
        throw new InternalServerErrorException('Order ID not found in URL');
      }

      const response = await axios.post(
        `${this.PAYPAL_URL}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID ?? '',
            password: process.env.PAYPAL_CLIENT_SECRET ?? '',
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const id = response.data.purchase_units[0].payments.captures[0].id
      const status = response.data.purchase_units[0].payments.captures[0].status
      const netAmount = response.data.purchase_units[0].payments.captures[0].seller_receivable_breakdown.paypal_fee.value
      const paymentFee = response.data.purchase_units[0].payments.captures[0].seller_receivable_breakdown.net_amount.value

      if (status === "COMPLETED") {
        
      }



      return response.data.purchase_units[0].payments.captures[0]
    } catch (error) {
      console.error('Error capturing order:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to capture PayPal order');
    }
  }

  async orderAndComission(amount: number, receiverEmail: string, comissionPercentage: number) {
    const commission = amount / comissionPercentage
    
    const request = new paypal.orders.OrdersCreateRequest()
    request.prefer('return=representation')
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: amount.toFixed(2),
              }
            }
          },
          payee: {
            email_address: receiverEmail,
          }
        }
      ],
      application_context: {
        return_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
      },
      payment_instruction: {
        disbursement_mode: 'INSTANT',
        platform_fees: [
          {
            amount: {
              currency_code: 'USD',
              value: commission.toFixed(2)
            }
          }
        ]
      }
    })

    const response = await this.client.execute(request)
    return response.result.links[1].href
  }
}
