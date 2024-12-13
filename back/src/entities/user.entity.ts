import { CivilStatus, EmploymentStatus } from "../enums/user";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from "./account.entity";

@Entity({
    name: "users"
})

export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 50, nullable: false })
    name: string;

    @Column({ length: 50, nullable: false })
    lastName: string;

    @Column({ unique: true, length: 50, nullable: false })
    email: string;

    @Column({ nullable: false, type: "bigint" })
    phone: number;
    
    @Column()
    nationality: string;

    @Column({ unique: true, nullable: false, type: "bigint" })
    dni: number;
    
    @Column({ nullable: false })
    DOB: Date;
    
    @Column()
    civilStatus: CivilStatus;
    
    @Column()
    employmentStatus: EmploymentStatus;

    @Column({ default: true })
    isActive: boolean;
    
    @OneToOne(() => Account, (account) => account.user_ )
    account_: Account
}