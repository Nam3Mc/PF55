import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from '../../entities/property.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationsService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
  ) {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      throw new Error('Credenciales de correo electrónico no definidas en el archivo .env');
    }

    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587, //Usar el puerto 465 para SSL
      secure: false, //cambiar a true para SSL
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
      from: process.env.EMAIL_FROM,
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

  async sendStatusChangeEmail(propertyId: string): Promise<void> {
    // Buscar la propiedad con relaciones usando el repositorio inyectado
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
      relations: ['account_', 'account_.user_'],
    });

    // Validar si la propiedad y las relaciones necesarias existen
    if (!property || !property.account_ || !property.account_.user_) {
      throw new Error('No se encontró la propiedad o el usuario asociado para enviar el correo.');
    }

    // Extraer el email del usuario y otros datos relevantes
    const userEmail = property.account_.user_.email;
    const subject = `Cambio de estado en tu propiedad: ${property.name}`;
    const text = `Hola, el estado de tu propiedad "${property.name}" ha cambiado a: ${property.isActive}`;
    const html = `
      <h1>Cambio de estado en tu propiedad</h1>
      <p>Tu propiedad ha cambiado de estado:</p>
      <ul>
        <li><strong>Nombre:</strong> ${property.name}</li>
        <li><strong>Nuevo estado:</strong> ${property.isActive}</li>
      </ul>
    `;

    // Enviar el correo utilizando el método sendEmail
    try {
      await this.sendEmail(userEmail, subject, text, html);
      console.log(`Correo enviado correctamente a ${userEmail}`);
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      throw new Error('No se pudo enviar el correo al usuario.');
    }
  }
}
