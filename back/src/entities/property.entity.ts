import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Contract } from "./contract.entity";
import { Account } from "./account.entity";
import { Image } from "./image.entity";
import { Amenities } from "./amenitie.entity";
import { Max, Min } from "class-validator/types";

@Entity({
    name: "properties"
})

export class Property {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    isActive: boolean

    @Column({ length: 50, nullable: false })
    name: string
    
    @Column({ nullable: false })
    price: number

    @Column({ nullable: false })
    bedrooms: number

    @Column({ nullable: false })
    bathrooms: number
    
    @Column({ type: "text", nullable: false })
    description: string
    
    @Column({ length: 50, nullable: false })
    state: string

    @Column({ length: 50, nullable: false })
    city: string

    @Column({ nullable: false })
    capacity: number

    @Column({type: "int" })
    rating: number

    // @Column()
    // checkIn: number

    // @Column()
    // checkOut: number

    @Column()
    hasMinor: boolean
    
    @Column()
    pets: boolean

    @Column()
    latitude: string

    @Column()
    longitude: string

    @OneToMany( () => Contract, (contract) => contract.property_)
    contract_: Contract[]

    @ManyToOne( () => Account, (account) => account.property_)
    account_: Account

    @OneToMany( () => Image, (image) => image.property_)
    image_: Image[]

    @OneToOne( () => Amenities, (amenities) => amenities.property_)
    amenities_: Amenities

}
