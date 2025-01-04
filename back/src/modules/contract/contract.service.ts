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
    private readonly accountDB: AccountService
  ) {}
  
  async isDateAvailable(checkIn: Date, checkOut: Date): Promise<boolean> {
    const isAvailable = await this.contractDB
      .createQueryBuilder('contract')
      .where(
        '(:checkIn BETWEEN contract.startDate AND contract.endDate OR :checkOut BETWEEN contract.startDate AND contract.endDate)',
        { checkIn, checkOut },
      )
      .orWhere(
        '(:checkIn <= contract.startDate AND :checkOut >= contract.endDate)',
        { checkIn, checkOut },
      )
      .getCount();

    return isAvailable === 0;
  }

  async getContractById (id: string): Promise<Contract> {
    const contract = await this.contractDB.findOneBy({id})
    return contract
  }

  async saveContract(contract: Contract): Promise<Contract> {
    const savedContract = await this.contractDB.save(contract)
    return savedContract
  }

  async createContract (contractData: CreateContractDto) {
    const {startDate, endDate, guests, pet, minor, accountId, propertyId} = contractData
    const property = await this.propertyDB.justProperty(propertyId)
    const account = await this.accountDB.justAccount(accountId) 
    const checkIn = new Date(startDate)
    const checkOut = new Date(endDate)

    if (property) {
      const available = await this.isDateAvailable(checkIn, checkOut)
      if (available) {

        const contract = new Contract

        contract.startDate = checkIn
        contract.endDate = checkOut
        contract.guests = guests
        contract.pet = pet
        contract.minor = minor
        contract.property_ = property
        contract.account_ = account

        const createdContrat = await this.contractDB.save(contract)  
        return createdContrat
      }
      else {
        throw new BadRequestException("Las fechas seleccionadas no estan disponibles")
      }
    }
    else {
      throw new BadRequestException("No se pudo generar tu reservacion")
    }
  }
}
 