import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageService } from './messages.service';
import { Message } from '../../entities/message.entity';
import { Account } from '../../entities/account.entity';
import { NotificationsModule } from '../notifications/notifications.module';
import { MessagesGateway } from './messages.gateway';
import { MessagesController } from './messages.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Account]),
    NotificationsModule,
  ],
  providers: [MessageService, MessagesGateway],
  controllers: [MessagesController],
  exports: [MessageService],
})
export class MessagesModule {}
