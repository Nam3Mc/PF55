import { ApiOperation, ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsUUID } from "class-validator"

export class IdDto {

    @ApiProperty({ description: "an UIDD id", example: "bf9d7f8f-1d4d-451e-a2c2-5c355ea38872" })
    @IsUUID()
    @IsNotEmpty()
    id: string
}