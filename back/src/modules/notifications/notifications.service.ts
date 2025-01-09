import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      throw new Error('Credenciales de correo electrónico no definidas en el archivo .env');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, 
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false, 
      },
    });
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    //console.log(`Enviando correo a ${to} con el asunto: ${subject}`);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }), 
    };

    try {
      await this.transporter.sendMail(mailOptions);
      //console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      if (error.code === 'ECONNREFUSED') {
        throw new Error('No se pudo establecer la conexión con el servidor de correo.');
      } else {
        throw new Error('No se pudo enviar el correo electrónico. Intente más tarde.');
      }
    }
  }

  async notifyPropertyPublished(to: string, propertyDetails: any): Promise<void> {
    const subject = '¡Tu propiedad ha sido publicada!';
    const text = `Hola, tu propiedad ha sido publicada exitosamente. Detalles: ${JSON.stringify(propertyDetails)}`;
    const html = `
      <h1>¡Tu propiedad ha sido publicada!</h1>
      <p>Detalles de tu propiedad:</p>
      <ul>
        <li>Nombre: ${propertyDetails.name}</li>
        <li>Ubicación: ${propertyDetails.location}</li>
        <li>Precio: ${propertyDetails.price}</li>
      </ul>
    `;
    await this.sendEmail(to, subject, text, html);
  }
}
