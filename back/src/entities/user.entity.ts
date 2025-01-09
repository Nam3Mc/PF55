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

    @Column({ nullable: true, type: "bigint" })
    phone?: number;
    
    @Column({ length: 50, nullable: false })
    nationality: string;

    @Column({ unique: true, nullable: true, type: "bigint" })
    dni?: number;
    
    @Column({ nullable: false })
    DOB: Date;
    
    @Column({ type: 'enum', enum: CivilStatus, nullable: true })
    civilStatus?: CivilStatus;
    
    @Column({ type: 'enum', enum: EmploymentStatus, nullable: true })
    employmentStatus?: EmploymentStatus;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'text', nullable: true })
    photo?: string;
    
    @OneToOne(() => Account, (account) => account.user_, { cascade: true })
    account_: Account;
    
}