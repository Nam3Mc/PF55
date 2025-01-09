import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Contract } from './contract.entity';
import { Property } from './property.entity';
import { Role } from '../enums/account';
import { Message } from './message.entity';

@Entity({ name: 'accounts' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: Role.USER })
  role: Role;

  @OneToOne(() => User, (user) => user.account_, { nullable: false, cascade: true })
  @JoinColumn({ name: 'user_id' }) // Define la columna en la base de datos
  user_: User;

  @OneToMany(() => Contract, (contract) => contract.account_)
  contract_: Contract[];

  @OneToMany(() => Property, (property) => property.account_)
  property_: Property[];

  @ManyToMany(() => Property, (property) => property.favorites_)
  @JoinTable() // Crea una tabla intermedia que relaciona cuentas y propiedades
  favorites_: Property[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.recipient)
  receivedMessages: Message[];
}
