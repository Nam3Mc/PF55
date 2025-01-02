// import { PaymentStatus } from "../enums/payments";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./contract.entity";
import { PaymentStatus } from "../enums/payments";

@Entity({
    name: "payments"
})

export class Payment {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    transactionId: string

    @Column()
    value: number

    @Column()
    dueDate: Date

    @Column()
    status: PaymentStatus = PaymentStatus.PENDING

    @OneToMany( () => Contract, (contract) => contract.payment_)
    contract_: Contract
    
}
