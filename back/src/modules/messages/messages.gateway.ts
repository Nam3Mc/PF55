import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from '../notifications/notifications.service';

@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  // Maneja la conexión de un cliente
  handleConnection(client: Socket) {
    try {
      this.emitConnectionSuccess(client);
      console.log(`Cliente conectado: ${client.id}`);
    } catch (error) {
      console.error(`Error al manejar la conexión del cliente ${client.id}:`, error);
    }
  }

  // Maneja la desconexión de un cliente
  handleDisconnect(client: Socket) {
    try {
      console.log(`Cliente desconectado: ${client.id}`);
    } catch (error) {
      console.error(`Error al manejar la desconexión del cliente ${client.id}:`, error);
    }
  }

  // Notificar al usuario, emitir evento y manejar notificaciones
  async notifyOrSendMessage(event: string, payload: any) {
    try {
      switch (event) {
        case 'propertyPublished':
          await this.handlePropertyPublished(payload);
          break;
        case 'message':
          await this.handleMessageReceived(payload);
          break;
        default:
          this.server.emit(event, payload);
          console.log(`Evento emitido: ${event}`, payload);
          break;
      }
    } catch (error) {
      console.error(`Error al notificar al usuario en el evento ${event}:`, error);
    }
  }

  // Emitir un evento de conexión exitosa
  private emitConnectionSuccess(client: Socket) {
    this.server.emit('connectionSuccess', {
      message: '¡Conexión exitosa!',
      clientId: client.id,
    });
  }

  // Manejo específico para 'propertyPublished'
  private async handlePropertyPublished(payload: any) {
    try {
      if (payload.userEmail) {
        await this.notificationsService.sendEmail(
          payload.userEmail,
          'Tu propiedad ha sido publicada',
          `La propiedad con ID ${payload.propertyId} ha sido publicada con éxito.`,
        );
        console.log('Correo enviado al usuario:', payload.userEmail);
      }

      this.server.emit('propertyPublished', payload);
    } catch (error) {
      console.error(`Error al manejar evento 'propertyPublished':`, error);
    }
  }

  // Manejo específico para 'message'
  private async handleMessageReceived(payload: any) {
    try {
      // Aquí puedes agregar lógica para almacenar el mensaje si es necesario
      console.log('Mensaje enviado desde:', payload.senderId, 'hacia:', payload.recipientId);
      this.server.emit('messageReceived', payload);  // Emitir un evento de mensaje recibido
    } catch (error) {
      console.error(`Error al manejar evento 'message':`, error);
    }
  }
}
