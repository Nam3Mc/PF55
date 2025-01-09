import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Account } from './account.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Account, (account) => account.sentMessages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'sender_id' })
  sender: Account;

  @ManyToOne(() => Account, (account) => account.receivedMessages, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Account;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn({ type: 'timestamp' })
  timestamp: Date;

  @Column({ default: false })
  isRead: boolean;
}
