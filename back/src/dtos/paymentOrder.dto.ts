import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsString,  } from "class-validator/types";

export class PaymentOrderDto {
    @ApiProperty({ example: 450.00, description: 'Amount to pay'})
    @IsNotEmpty()
    @IsNumber()
    amount: number

    @ApiProperty({ example: 0.08, description: 'Comission per booking in percentage'})
    @IsNumber()
    comissionPercentage: number

    @ApiProperty({ example: 'sb-z3n5934929576@personal.example.com', description: 'Amount to pay'})
    @IsNotEmpty()
    @IsString()
    receiverEmail: string

}