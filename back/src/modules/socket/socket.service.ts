import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
    this.server.on('connection', (socket: Socket) => this.handleConnection(socket));
  }

  handleConnection(socket: Socket) {
    console.log('Cliente conectado:', socket.id);

    // Escuchar eventos enviados desde el cliente
    socket.on('mensaje', (data) => {
      console.log('Mensaje recibido:', data);
      this.server.emit('mensaje', 'Mensaje recibido correctamente');
    });

    socket.on('disconnect', () => {
      this.handleDisconnect(socket);
    });
  }

  handleDisconnect(socket: Socket) {
    console.log('Cliente desconectado:', socket.id);
  }
}
