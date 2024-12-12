import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CreatePropertyDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    name: string
    
    @IsNotEmpty()
    @IsNumber()
    price: number
    
    @IsNotEmpty()
    @IsString()
    description: string
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    address: string

    @IsBoolean()   
    hasMinor: boolean

    @IsBoolean()
    pets: boolean

    @IsString()
    @IsUUID()
    accountId: string
    
    @IsArray()
    @IsOptional()
    image: string[]
}
