import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { Account } from '../../entities/account.entity';
import { Server, Socket } from 'socket.io';

@Injectable()
export class MessageService {
  private io: Server;
  private userSocketMap: Map<string, string> = new Map(); // Map para asociar accountId con socketId

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  setServer(server: Server) {
    this.io = server;

    // Manejar la conexión de usuarios
    this.io.on('connection', (socket: Socket) => {
      console.log(`Cliente conectado: ${socket.id}`);

      // Registrar el accountId con el socketId
      socket.on('register', (accountId: string) => {
        this.userSocketMap.set(accountId, socket.id);
        console.log(`Asociado accountId ${accountId} con socketId ${socket.id}`);
      });

      // Manejar la desconexión
      socket.on('disconnect', () => {
        const accountId = Array.from(this.userSocketMap.entries()).find(
          ([, value]) => value === socket.id,
        )?.[0];

        if (accountId) {
          this.userSocketMap.delete(accountId);
          console.log(`Desconectado accountId ${accountId}`);
        }

        console.log(`Cliente desconectado: ${socket.id}`);
      });
    });

    console.log('Socket.IO configurado en MessageService');
  }

  async sendMessage(senderId: string, recipientId: string, content: string): Promise<Message> {
    const sender = await this.accountRepository.findOne({
      where: { user_: { id: senderId } },
      relations: ['user_'],
    });

    const recipient = await this.accountRepository.findOne({
      where: { user_: { id: recipientId } },
      relations: ['user_'],
    });

    if (!sender) {
      throw new NotFoundException(`El remitente con ID ${senderId} no existe`);
    }

    if (!recipient) {
      throw new NotFoundException(`El destinatario con ID ${recipientId} no existe`);
    }

    const newMessage = this.messageRepository.create({
      sender,
      recipient,
      message: content,
    });

    const savedMessage = await this.messageRepository.save(newMessage);

    if (savedMessage.sender) {
      delete savedMessage.sender.password;
    }

    if (savedMessage.recipient) {
      delete savedMessage.recipient.password;
    }

    const recipientSocketId = this.userSocketMap.get(recipientId);

    if (recipientSocketId) {
      this.io.to(recipientSocketId).emit('newMessage', savedMessage);
      console.log(`Mensaje enviado al socket ${recipientSocketId}`);
    } else {
      console.log(`El destinatario con ID ${recipientId} no está conectado. Mensaje guardado en la base de datos.`);
    }

    return savedMessage;
  }

  async getSentMessages(accountId: string): Promise<Message[]> {
    const sentMessages = await this.messageRepository.find({
      where: { sender: { user_: { id: accountId } } },
      relations: ['recipient'],
      order: { timestamp: 'DESC' },
    });

    return sentMessages.map((message) => {
      if (message.recipient) {
        delete message.recipient.password;
      }
      return message;
    });
  }

  async getReceivedMessages(accountId: string): Promise<Message[]> {
    const receivedMessages = await this.messageRepository.find({
      where: { recipient: { user_: { id: accountId } } },
      relations: ['sender'],
      order: { timestamp: 'DESC' },
    });

    return receivedMessages.map((message) => {
      if (message.sender) {
        delete message.sender.password;
      }
      return message;
    });
  }

  async markMessageAsRead(messageId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({ where: { id: messageId } });

    if (!message) {
      throw new NotFoundException(`El mensaje con ID ${messageId} no existe`);
    }

    if (message.isRead) {
      throw new NotFoundException(`El mensaje con ID ${messageId} ya está marcado como leído`);
    }

    message.isRead = true;

    return this.messageRepository.save(message);
  }

  async getMessagesFromTo(senderId: string, recipientId: string): Promise<Message[]> {
    const messages = await this.messageRepository.find({
        where: {
            sender: { user_: { id: senderId } },
            recipient: { user_: { id: recipientId } },
        },
        relations: ['sender', 'recipient'],
        order: { timestamp: 'DESC' },
    });

    return messages.map((message) => {
        const { sender, recipient, ...filteredMessage } = message;
        return filteredMessage as Message;
    });
}

async getMessagesToFrom(recipientId: string, senderId: string): Promise<Message[]> {
    const messages = await this.messageRepository.find({
        where: {
            recipient: { user_: { id: recipientId } },
            sender: { user_: { id: senderId } },
        },
        relations: ['sender', 'recipient'],
        order: { timestamp: 'DESC' },
    });

    // Actualizar el campo isRead a true
    const recipient = await this.accountRepository.findOne({ where: { user_: { id: recipientId } } });
    const sender = await this.accountRepository.findOne({ where: { user_: { id: senderId } } });

    await this.messageRepository.update(
        {
            recipient,
            sender,
        },
        { isRead: true },
    );

    return messages.map((message) => {
        const { sender, recipient, ...filteredMessage } = message;
        return filteredMessage as Message;
    });
}
}
