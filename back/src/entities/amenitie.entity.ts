import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Property } from "./property.entity";

@Entity({
    name: 'amenities'
})

export class Amenities {
    
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    wifi: boolean

    @Column()
    tv: boolean

    @Column()
    airAcconditioning: boolean

    @Column()
    piscina: boolean

    @Column()
    parqueadero: boolean

    @Column()
    kitchen: boolean

    @OneToOne( () => Property, (property) => property.amenities_)
    property_: Property

}