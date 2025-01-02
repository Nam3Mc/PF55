import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly PAYPAL_URL = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';

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
      const reqUrl = 'https://example.com/success?token=8DE27637T07523149&PayerID=PM4MW29ME9TH8';
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
}
