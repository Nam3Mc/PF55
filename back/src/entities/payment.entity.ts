// import { PaymentStatus } from "../enums/payments";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
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
    netAmount: number

    @Column()
    paymentFee: number

    @Column()
    paymentDate: Date

    @Column()
    status: PaymentStatus = PaymentStatus.PENDING

    @OneToOne( () => Contract, (contract) => contract.payment_)
    contract_: Contract
    
}
