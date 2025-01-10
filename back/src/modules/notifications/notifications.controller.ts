import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

class UserRegisteredDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

class PropertyPublishedDto {
  @IsString()
  @IsNotEmpty()
  propertyId: string;

  @IsEmail()
  @IsNotEmpty()
  userEmail: string;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('user-registered')
  @ApiOperation({ summary: 'Notificar al usuario registrado' })
  @ApiBody({
    description: 'Datos del usuario registrado',
    type: UserRegisteredDto,
    examples: {
      'application/json': {
        value: {
          email: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo de bienvenida enviado',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al enviar el correo',
  })
  async notifyUserRegistered(@Body() body: UserRegisteredDto) {
   // console.log('Body recibido en notifyUserRegistered:', body);
    try {
      // Llamar al servicio de notificaciones
      await this.notificationsService.sendEmail(
        body.email,
        '¡Bienvenido a RentaFácil!',
        'Gracias por registrarte en nuestra plataforma.',
      );
      return { message: 'Correo de bienvenida enviado' };
    } catch (error) {
      console.error('Error al enviar el correo de bienvenida:', error);
      throw new BadRequestException('Error al enviar el correo');
    }
  }

  @Post('property-published')
  @ApiOperation({ summary: 'Notificar la publicación de una propiedad' })
  @ApiBody({
    description: 'Datos de la propiedad publicada',
    type: PropertyPublishedDto,
    examples: {
      'application/json': {
        value: {
          propertyId: '12345',
          userEmail: 'user@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Correo enviado',
  })
  @ApiResponse({
    status: 400,
    description: 'Error al enviar el correo',
  })
  async notifyPropertyPublished(@Body() body: PropertyPublishedDto) {
    try {
      // Llamar al servicio de notificaciones
      await this.notificationsService.sendEmail(
        body.userEmail,
        'Tu propiedad ha sido publicada',
        `La propiedad con ID ${body.propertyId} ha sido publicada con éxito.`,
      );
      return { message: 'Correo enviado' };
    } catch (error) {
      console.error('Error al enviar el correo de propiedad publicada:', error);
      throw new BadRequestException('Error al enviar el correo');
    }
  }
}
