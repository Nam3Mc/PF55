import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Max, MaxLength, Min, MinLength } from "class-validator"
import { TypeOfProperty } from "../enums/property"

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

    @ApiProperty({ example: "Buenos Aires", description: "State where property is located" })
    @IsNotEmpty()
    @IsString()
    state: string

    @ApiProperty({ example: "Mar del Plata", description: "ciudad donde se ubica la propiedad" })
    @IsNotEmpty()
    @IsString()
    city: string

    @ApiProperty({ example: "Argentina", description: "Pais donde se ubica la propiedad" })
    @IsNotEmpty()
    @IsString()
    country: string

    @ApiProperty({ example: "Argentina", description: "Pais donde se ubica la propiedad" })
    @IsString()
    @IsOptional()
    address: string
    
    @ApiProperty({ example: "2", description: "How many Bedrooms your property has" })
    @IsNotEmpty()
    @IsNumber()
    bedrooms: number

    @ApiProperty({ example: "1", description: "How many Bathrooms your property has" })
    @IsNotEmpty()
    @IsNumber()
    bathrooms: number

    @ApiProperty({ example: "4", description: "How many people do you allow in your property" })
    @IsNotEmpty()
    @IsNumber()
    capacity: number

    @ApiProperty({ example: "-34.6037 ", description: "Coordenates" })
    @IsNotEmpty()
    latitude: any

    @ApiProperty({ example: "-58.3816", description: "Coordenates" })
    @IsNotEmpty()
    longitude: any

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

    @ApiProperty({ example: true, description: "Does the property has wifi" })
    @IsBoolean()
    wifi: boolean;

    @ApiProperty({ example: true, description: "Does the property has tv" })
    @IsBoolean()
    tv: boolean;

    @ApiProperty({ example: false, description: "Does the property has air conditioning" })
    @IsBoolean()
    airConditioning: boolean;
   
    @ApiProperty({ example: false, description: "Does the property has pool" })
    @IsBoolean()
    piscina: boolean;
   
    @ApiProperty({ example: true, description: "Does the property has parking" })
    @IsBoolean()
    parqueadero: boolean;

    @ApiProperty({ example: true, description: "Does the property has kitchen" })
    @IsBoolean()
    cocina: boolean;

    @ApiProperty({ example: TypeOfProperty.HOUSE, description: "Could be apparment, house or room" })
    @IsEnum(TypeOfProperty)
    type: TypeOfProperty = TypeOfProperty.HOUSE

}