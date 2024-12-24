import { Role } from "../enums/account";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Contract } from "./contract.entity";
import { Property } from "./property.entity";

@Entity({
    name: "accounts"
})

export class Account {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false })
    password: string

    @Column()
    role: Role = Role.USER

    @OneToOne(() => User, (user) => user.account_)
    @JoinColumn()
    user_: User;

    @OneToMany(() => Contract, (contract) => contract.account_ )
    contract_: Contract[]

    @OneToMany( () => Property, (property) => property.account_)
    property_: Property[]

    @ManyToMany(() => Property, (property) => property.favorites_)
    @JoinTable() // Crea una tabla intermedia que relaciona cuentas y propiedades
    favorites_: Property[];
}
