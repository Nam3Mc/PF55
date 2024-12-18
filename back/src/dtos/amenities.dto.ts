import { ApiProperty } from "@nestjs/swagger";
import {  IsString } from "class-validator/types";

export class AmenitiesDto {

    @ApiProperty({ example: [
        "'wifi': True''",
        "'Tv': 'True'",
        "'airAcconditioning': 'True'",
        "'piscina': 'True'",
        "'parqueadero': 'True'",
        "'kitchen': 'True'",
        ],description: "Mark true o false for each amenity your property has" })
    @IsString()
    amenities: []

}