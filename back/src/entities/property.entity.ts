import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./contract.entity";
import { Account } from "./account.entity";
import { Image } from "./image.entity";

@Entity({
    name: "properties"
})

export class Property {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ length: 50, nullable: false })
    name: string
    
    @Column({ nullable: false })
    price: number
    
    @Column({ type: "text", nullable: false })
    description: string
    
    @Column({ length: 50, nullable: false })
    address: string

    @Column()
    hasMinor: boolean
    
    @Column()
    pets: boolean

    @OneToMany( () => Contract, (contract) => contract.property_)
    contract_: Contract[]

    @ManyToOne( () => Account, (account) => account.property_)
    account_: Account

    @OneToMany( () => Image, (image) => image.property_)
    image_: Image[]

}
