import { Injectable, InternalServerErrorException } from '@nestjs/common';
import paypal from '@paypal/checkout-server-sdk'
import axios from 'axios';
import { PaymentOrderDto } from '../../dtos/paymentOrder.dto';

@Injectable()
export class PaymentsService {  
  private environment: paypal.core.SandboxEnvironment;
  private client: paypal.core.PayPalHttpClient;
  private readonly PAYPAL_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

  constructor()
    {
      this.environment = new paypal.core.SandboxEnvironment(
        process.env.PAYPAL_CLIENT_ID,
        process.env.PAYPAL_CLIENT_SECRET 
      )
      this.client = new paypal.core.PayPalHttpClient(this.environment)
   }


  async newPayment(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');

      const response = await axios.post(
        `${this.PAYPAL_URL}/v1/oauth2/token`,
        params,
        {
          auth: {
            username: process.env.PAYPAL_CLIENT_ID ?? '',
            password: process.env.PAYPAL_CLIENT_SECRET ?? '',
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      const access_token = response.data.access_token;

      const order = {
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: '100.00', 
            },
            description: 'Pago de prueba',
          },
        ],
        application_context: {
          return_url: 'https://example.com/success',
          cancel_url: 'https://example.com/cancel',
        },
      };

      const orderResponse = await axios.post(
        `${this.PAYPAL_URL}/v2/checkout/orders`,
        order,
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log(orderResponse.data);
      return orderResponse.data.links.find(link => link.rel === 'approve')?.href || '';
    } catch (error) {
      console.error('Error creating payment:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create PayPal payment');
    }
  }

  async captureOrder(): Promise<any> {
    try {
      const reqUrl = 'https://example.com/success?token=9HK55769T4805532G&PayerID=PM4MW29ME9TH8';
      const url = new URL(reqUrl);
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

      return response.data;
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
