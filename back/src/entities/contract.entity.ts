
import { ContractStatus } from "../enums/contract";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";
import { Payment } from "./payment.entity";
import { Property } from "./property.entity";

@Entity({
    name: "contracts"
})

export class Contract {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    startDate: Date

    @Column()
    endDate: Date

    @Column()
    guests: number

    @Column()
    pet: boolean

    @Column()
    minor: boolean

    @Column()
    status: ContractStatus = ContractStatus.NEGOCIATION

    @ManyToOne(() => Account, (account) => account.contract_)
    account_: Account

    @OneToOne(() => Payment, (payment) => payment.contract_)
    payment_: Payment

    @ManyToOne(() => Property, (property) => property.contract_)
    property_: Property[]
}
