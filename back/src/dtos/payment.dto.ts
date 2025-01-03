import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator"

export class PaymentDto {

    @ApiProperty({ 
        example: "https://www.sandbox.paypal.com/checkoutnow?token=74863373Y3870251J",
        description: "This is the url where you are redirected after completed the payment"
    })
    @IsString()
    @IsNotEmpty()
    url: string

    @ApiProperty({ 
        example: "2ea5b5a4-9ef6-486d-8df4-50bfcf152047",
        description: "The contract Id to update the contract status"
    })
    @IsNotEmpty()
    @IsUUID()
    contractId: string
    
}