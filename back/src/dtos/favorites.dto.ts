import { ApiProperty } from "@nestjs/swagger"

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