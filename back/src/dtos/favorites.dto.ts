import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID } from "class-validator/types"

export class FavoritesDto{
   
    @ApiProperty({
        description: "s",
        example: "s"
    })
    // @IsString()
    accountId: string

    @ApiProperty({
        description: "s",
        example: "s"
    })
    // @IsString()
    propertyId: string
}