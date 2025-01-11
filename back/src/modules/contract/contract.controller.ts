import { Controller, Get, Post, Body, Patch, Param, Put } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateContractDto } from '../../dtos/create-contract.dto';

@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: ContractService
  ) {}

  @Get('propety/:id')
  @ApiOperation({ summary: 'this endpoint gives all contracts for an specific property'})
  getPropertyContracts(@Param('properrtyId') propertyId: string) {
    return this.contractService.getPropertyContracts(propertyId)
  }

  @Get(':id')
  @ApiOperation({ summary: "get an specifict contract by its ID"})
  getContractById(@Param("id") id: string) {
    return this.contractService.getContractById(id)
  }

  @Get()
  @ApiOperation({ summary: 'This endpoint gets all the contracts or reservations' })
  getContracts() {
    return this.contractService.getContracts()
  }

  // @Put()
  // @ApiOperation({summary: 'You can request a modification in your contrat o reservation'})
  // updateContract(@Body() contractData: Partial<CreateContractDto>) {
    // return this.contractService.modifyContract(contractData)
  // }

}
