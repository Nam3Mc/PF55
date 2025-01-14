import { Controller, Get, Param } from '@nestjs/common'
import { ContractService } from './contract.service'
import { ApiOperation } from '@nestjs/swagger'
import { IdDto } from '../../dtos/id.dto'

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

  @Get("user/:id")
  @ApiOperation({ summary: "Get all reservations for an user by his account ID"})
  getUserContrats(@Param('id') id: IdDto) {
    return this.contractService.userContracts(id)
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


}
