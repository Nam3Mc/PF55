import { Controller, Post, Body, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MessageService } from './messages.service';
import { CreateMessageDto } from '../../dtos/create-message.dto';

@ApiTags('messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessageService) {}

  // Ruta para enviar un mensaje
  @Post('send')
  @ApiOperation({ summary: 'Enviar un mensaje' })
  @ApiBody({
    description: 'Datos necesarios para enviar un mensaje',
    type: CreateMessageDto,
    examples: {
      example1: {
        summary: 'Ejemplo de mensaje',
        value: {
          senderId: '123456',
          recipientId: '654321',
          content: 'Hola, este es un mensaje de prueba',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Mensaje enviado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async sendMessage(@Body() createMessageDto: CreateMessageDto) {
    const { senderId, recipientId, content } = createMessageDto;
    return this.messagesService.sendMessage(senderId, recipientId, content);
  }

  // Ruta para obtener los mensajes enviados por un usuario
  @Get('sent/:userId')
  @ApiOperation({ summary: 'Obtener mensajes enviados por un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario que envió los mensajes', example: '12345' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes enviados.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async getSentMessages(@Param('userId') userId: string) {
    return this.messagesService.getSentMessages(userId);
  }

  // Ruta para obtener los mensajes recibidos por un usuario
  @Get('received/:userId')
  @ApiOperation({ summary: 'Obtener mensajes recibidos por un usuario' })
  @ApiParam({ name: 'userId', description: 'ID del usuario que recibió los mensajes', example: '67890' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes recibidos.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async getReceivedMessages(@Param('userId') userId: string) {
    return this.messagesService.getReceivedMessages(userId);
  }

  // Endpoint para filtrar mensajes enviados de A hacia B
  @Get('sentFromTo')
  @ApiOperation({ summary: 'Obtener mensajes enviados de A hacia B' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes enviados de A hacia B.' })
  @ApiResponse({ status: 404, description: 'No se encontraron mensajes.' })
  async getMessagesFromTo(
    @Query('senderId') senderId: string,
    @Query('recipientId') recipientId: string,
  ) {
    return this.messagesService.getMessagesFromTo(senderId, recipientId);
  }

  // Endpoint para filtrar mensajes recibidos por B de parte de A
  @Get('receivedFrom')
  @ApiOperation({ summary: 'Obtener mensajes recibidos por B de parte de A' })
  @ApiResponse({ status: 200, description: 'Lista de mensajes recibidos por B de parte de A.' })
  @ApiResponse({ status: 404, description: 'No se encontraron mensajes.' })
  async getMessagesToFrom(
    @Query('recipientId') recipientId: string,
    @Query('senderId') senderId: string,
  ) {
    return this.messagesService.getMessagesToFrom(recipientId, senderId);
  }
}
