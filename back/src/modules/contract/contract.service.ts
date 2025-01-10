import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "../../entities/contract.entity";
import { Repository } from "typeorm";
import { PropertyService } from "../property/property.service";
import { CreateContractDto } from "../../dtos/create-contract.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AccountService } from "../account/account.service";
import { ContractStatus } from "../../enums/contract";
import { reservationCreator } from "../../helpers/reservationCreator";

@Injectable()
export class ContractService {

  constructor(
    @InjectRepository(Contract)
    private readonly contractDB: Repository<Contract>,
    private readonly propertyDB: PropertyService,
    private readonly accountDB: AccountService
  ) {}
  async isDateAvailable(checkIn: string, checkOut: string, propertyId: string): Promise<boolean> {
    try {
      const inDay = new Date(checkIn);
      const outDay = new Date(checkOut);
        if (isNaN(inDay.getTime()) || isNaN(outDay.getTime())) {
        throw new Error('Las fechas proporcionadas no son válidas');
      }
      const contracts = await this.contractDB.find({
        where: { property_: { id: propertyId } },
      });
  
      if (contracts.length > 0) {
        for (let contract of contracts) {
          const contractStart = new Date(contract.startDate);
          const contractEnd = new Date(contract.endDate);
            if (
            (inDay >= contractStart && inDay < contractEnd) ||
            (outDay > contractStart && outDay <= contractEnd) || 
            (inDay <= contractStart && outDay >= contractEnd) 
          ) {
            return false; 
          }
        }
      }
        return true;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al verificar la disponibilidad de fechas: ${error.message}`
      );
    }
  }
  

  async getContractById(id: string): Promise<Contract> {
    try {
      const contract = await this.contractDB.findOneBy({ id });
      if (!contract) {
        throw new NotFoundException('Contrato no encontrado');
      }
      return contract;
    } catch (error) {
      throw new InternalServerErrorException('Error al buscar el contrato');
    }
  }

  async saveContract(contract: Contract): Promise<Contract> {
    try {
      const savedContract = await this.contractDB.save(contract);
      return savedContract;
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar el contrato');
    }
  }

  async createContract(contractData: CreateContractDto) {
    const { startDate, endDate, accountId, propertyId } = contractData;
    const property = await this.propertyDB.justProperty(propertyId);
    const account = await this.accountDB.justAccount(accountId);
    const contract = reservationCreator(contractData, property, account)
    const isAvailable = await this.isDateAvailable(startDate, endDate, propertyId)
    if (isAvailable) {
      const createdContract = await this.saveContract(contract)
      return createdContract
    }
    else {
      throw new BadRequestException( "Los dias de su reservacion no estan disponibles")
    }
  }
  
  async updateContract(contractId: string) {
    const contract = await this.getContractById(contractId)
    contract.status = ContractStatus.ACEPTED
    const updateContract = await this.contractDB.save(contract)
    return updateContract
  }
  
}
