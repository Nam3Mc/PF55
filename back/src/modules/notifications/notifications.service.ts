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
      host: 'smtp.gmail.com', // Servidor SMTP de Gmail
      port: 587, // Puerto para TLS
      secure: false, // Falso para TLS
      auth: {
        user: user,
        pass: pass,
      },
      tls: {
        rejectUnauthorized: false, // Opcional, para evitar problemas con certificados autofirmados
      },
    });
  }

  // Método para enviar correos electrónicos
  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }), // Incluye HTML si se proporciona
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Correo enviado a ${to}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo electrónico.');
    }
  }

  // Método para manejar notificaciones específicas como "property-published"
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
