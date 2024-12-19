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
    airConditioning: boolean

    @Column()
    piscina: boolean

    @Column()
    parqueadero: boolean

    @Column()
    cocina: boolean

    @OneToOne( () => Property, (property) => property.amenities_)
    property_: Property

}