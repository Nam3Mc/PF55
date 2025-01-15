
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import paypal from '@paypal/checkout-server-sdk';
import axios from 'axios';
import { url } from 'inspector';
const port = process.env.PORT


@Injectable()
export class PaypalService {
  private environment: paypal.core.SandboxEnvironment
  private client: paypal.core.PayPalHttpClient
  private readonly PAYPAL_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'

  constructor() {
    this.environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID!,
      process.env.PAYPAL_CLIENT_SECRET!
    );
    this.client = new paypal.core.PayPalHttpClient(this.environment);
  }

  async createOrder(amount: number, paypalEmail: string, commission: number) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
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
            email_address: paypalEmail,
          }
        }
      ],
      application_context: {
        return_url: `http://localhost:3000/profile`,
        cancel_url: `http://localhost:3000/CheckoutPreview`,
      },
      payment_instruction: {
        disbursement_mode: 'INSTANT',
        platform_fees: [
          {
            amount: {
              currency_code: 'USD',
              value: commission.toFixed(2),
            }
          }
        ]
      }
    });

    try {
      const response = await this.client.execute(request)
      const status = await  response.result.status
      return {response, status}
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
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
      return response.data.purchase_units[0].payments.captures[0]
    } catch (error) {
      console.error('Error capturing order:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to capture PayPal order');
    }
  }
}
