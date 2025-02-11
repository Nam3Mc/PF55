import { ApiProperty } from "@nestjs/swagger"
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsUUID } from "class-validator"

export class CreateContractDto {

    @ApiProperty({ 
        example: "2025-10-01T00:00:00.000Z",
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    startDate: string

    @ApiProperty({ 
        example: "2025-10-10T00:00:00.000Z",
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    endDate: string

    @ApiProperty({ 
        example: 2, 
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    @IsNumber()
    guests: number

    @ApiProperty({ 
        example: true,
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsBoolean()
    pet: boolean = false

    @ApiProperty({ 
        example: false,
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsBoolean()
    minor: boolean = true

    @ApiProperty({ 
        example: "3f448401-cf0d-4349-93f6-c326429c7d31",
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    @IsUUID()
    accountId: string
    
    @ApiProperty({ 
        example: "553a44b7-0022-43b1-b7c1-9f8b238085d5",
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    @IsUUID()    
    propertyId: string

    @ApiProperty({ 
        example: "sb-hcd34334948799@personal.example.com",
        description: "After create a contract you will recieive a link to proccess the payment" })
    @IsNotEmpty()
    @IsEmail()
    paypalEmail: string
}
