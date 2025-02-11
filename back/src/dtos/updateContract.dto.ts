import { ApiProperty, PartialType } from "@nestjs/swagger";
import { CreateContractDto } from "./create-contract.dto";
import { IsString } from "class-validator/types";

export class UpdateContractDto extends PartialType(CreateContractDto){

    @ApiProperty({ example: "3f448401-cf0d-4349-93f6-c326429c7d31", description: "contract Id "})
    @IsString()
    contractId: string

}