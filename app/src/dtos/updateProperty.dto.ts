import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreatePropertyDto } from "./create-property.dto";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdatePropertyDto extends PartialType(CreatePropertyDto) {
    
    @ApiProperty({ example: "fd56f94f-2a1b-4819-adda-63ed86fda855", description: "property ID toi update"})
    @IsString()
    @IsNotEmpty()
    id: string
}