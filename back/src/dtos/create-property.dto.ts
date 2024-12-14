import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreatePropertyDto {

    @ApiProperty({ example: "Beautiful Modern House", description: "Property's Titel" })
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    name: string
    
    @ApiProperty({ example: "350", description: "Price per mouth" })
    @IsNotEmpty()
    @IsNumber()
    price: number

    @ApiProperty({ example: "A spacious and modern house with beautiful surroundings", description: "Property's Description" })
    @IsNotEmpty()
    @IsString()
    description: string
    
    @ApiProperty({ example: "123 Greenfield Street", description: "Property's Address" })
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    address: string

    @ApiProperty({ example: true, description: "Do you allow minors" })
    @IsBoolean()   
    hasMinor: boolean

    @ApiProperty({ example: false, description: "Do you allow pets" })
    @IsBoolean()
    pets: boolean

    @ApiProperty({ example: "d2b52c60-4f53-11ee-be56-0242ac120002", description: "the property to link the picture" })
    @IsString()
    @IsUUID()
    accountId: string
    
    @ApiProperty({ example: [
        "https://hips.hearstapps.com/hmg-prod/images/casa-caracol-1526458370.jpeg?crop=0.669xw:1.00xh;0.331xw,0&resize=640:*",
        "https://images.homify.com/c_fill,f_auto,h_500,q_auto,w_1280/v1461736282/p/photo/image/1478928/mv_chontay_02.jpg",
        "https://www.casasparaconstruir.com/projetos/161/02.jpg",
        "https://www.construyehogar.com/wp-content/uploads/2016/01/Casa-moderna-un-piso.jpg"
        ], 
        description: "The picturs url array" })
    @IsArray()
    @IsOptional()
    images: string[]
}
