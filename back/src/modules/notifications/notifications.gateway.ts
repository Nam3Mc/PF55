import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({ cors: true })
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  handleConnection(client: Socket) {
    try {
      // Emitir un mensaje de conexión exitosa al cliente
      this.server.emit('connectionSuccess', {
        message: '¡Conexión exitosa!',
        clientId: client.id,
      });
      console.log(`Cliente conectado: ${client.id}`);
    } catch (error) {
      console.error(`Error al manejar la conexión del cliente ${client.id}:`, error);
    }
  }

  handleDisconnect(client: Socket) {
    try {
      console.log(`Cliente desconectado: ${client.id}`);
    } catch (error) {
      console.error(`Error al manejar la desconexión del cliente ${client.id}:`, error);
    }
  }

  async notifyUser(event: string, payload: any) {
    try {
      // Emitir un evento personalizado a todos los clientes conectados
      this.server.emit(event, payload);
      console.log(`Evento emitido: ${event}`, payload);

      // Si el evento requiere un correo, delegamos al servicio de notificaciones
      if (event === 'propertyPublished' && payload.userEmail) {
        await this.notificationsService.sendEmail(
          payload.userEmail,
          'Tu propiedad ha sido publicada',
          `La propiedad con ID ${payload.propertyId} ha sido publicada con éxito.`,
        );
        console.log('Correo enviado al usuario:', payload.userEmail);
      }
    } catch (error) {
      console.error(`Error al notificar al usuario en el evento ${event}:`, error);
    }
  }
}
