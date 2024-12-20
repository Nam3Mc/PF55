import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "../../entities/contract.entity";
import { Repository } from "typeorm";
import { PropertyService } from "../property/property.service";
import { CreateContractDto } from "../../dtos/create-contract.dto";
import { BadRequestException, Injectable } from "@nestjs/common";
import { dayCalculator } from "../../helpers/daysCalculator";
import { AccountService } from "../account/account.service";

@Injectable()
export class ContractService {

  constructor(
    @InjectRepository(Contract)
    private readonly contractDB: Repository<Contract>,
    private readonly propertyDB: PropertyService,
    // private readonly paymentDB,
    private readonly accountDB: AccountService
  ) {}

  async createContract (contractData: CreateContractDto): Promise<Contract> {
    const {startDate, endDate, guests, pet, minor, accountId, propertyId} = contractData
    const property = await this.propertyDB.getPropertyById(propertyId)
    const account = await this.accountDB.findAccountById(accountId) 

    if (property) {
      const price = (await this.propertyDB.getPropertyById(propertyId)).price
      const nights = dayCalculator(startDate, endDate)
      const total = price * nights
      
      const contract = new Contract
      contract.startDate = new Date(startDate)
      contract.endDate = new Date(endDate) 
      contract.guests = guests
      contract.pet = pet
      contract.minor = minor
      contract.property_ = property
      const createdContrat = await this.contractDB.save(contract) 

      return createdContrat
    }
    else {
      throw new BadRequestException("No se pudo generar tu reservacion")
    }
    
  }
}
 