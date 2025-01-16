import { Controller, Get, Param, UseGuards } from '@nestjs/common'
import { ContractService } from './contract.service'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { AuthGuard } from '../../guards/auth.guard'

@ApiTags('Contracts')
@ApiBearerAuth('AuthGuard')
@Controller('contract')
export class ContractController {
  constructor(
    private readonly contractService: ContractService
  ) {}

  @Get('proprety/:id')
  @ApiOperation({ summary: 'this endpoint gives all contracts for an specific property'})
  getPropertyContracts(@Param('propertyId') propertyId: string) {
    return this.contractService.getPropertyContracts(propertyId)
  }

  @Get("user/:id")
  @ApiOperation({ summary: "Get all reservations for an user by his account ID"})
  @UseGuards(AuthGuard)
  getUserContrats(@Param('id') id: string) {
    return this.contractService.userContracts(id)
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: "get an specifict contract by its ID"})
  getContractById(@Param("id") id: string) {
    return this.contractService.getContractById(id)
  }

  @Get()
  @ApiOperation({ summary: 'This endpoint gets all the contracts or reservations' })
  @UseGuards(AuthGuard)
  getContracts() {
    return this.contractService.getContracts()
  }


}
