import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, PropertyType } from "typeorm";
import { Contract } from "./contract.entity";
import { Account } from "./account.entity";
import { Image } from "./image.entity";
import { Amenities } from "./amenitie.entity";
import { TypeOfProperty } from "../enums/property";

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

    @Column()
    hasMinor: boolean
    
    @Column()
    pets: boolean

    @Column()
    latitude: string

    @Column()
    longitude: string

    @Column()
    type: TypeOfProperty = TypeOfProperty.HOUSE

    @OneToMany( () => Contract, (contract) => contract.property_, {cascade: true})
    contract_: Contract

    @ManyToOne( () => Account, (account) => account.property_, {cascade: true})
    account_: Account

    @OneToMany( () => Image, (image) => image.property_, {cascade: true})
    image_: Image[]

    @OneToOne( () => Amenities, (amenities) => amenities.property_, {cascade: true})
    @JoinColumn({ name: "amenities_id"})
    amenities_: Amenities

    @ManyToMany(() => Account, (account) => account.favorites_, {cascade: true})
    favorites_: Account[];

}
