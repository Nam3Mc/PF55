import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "../../entities/contract.entity";
import { Repository } from "typeorm";
import { PropertyService } from "../property/property.service";
import { CreateContractDto } from "../../dtos/create-contract.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AccountService } from "../account/account.service";
import { ContractStatus } from "../../enums/contract";

@Injectable()
export class ContractService {

  constructor(
    @InjectRepository(Contract)
    private readonly contractDB: Repository<Contract>,
    private readonly propertyDB: PropertyService,
    private readonly accountDB: AccountService
  ) {}
  
  async isDateAvailable(checkIn: Date, checkOut: Date): Promise<boolean> {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException('Error al verificar la disponibilidad de fechas');
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
    const { startDate, endDate, guests, pet, minor, accountId, propertyId } = contractData;
    try {
      const property = await this.propertyDB.justProperty(propertyId);
      if (!property) {
        throw new NotFoundException('Propiedad no encontrada');
      }

      const account = await this.accountDB.justAccount(accountId);
      if (!account) {
        throw new NotFoundException('Cuenta no encontrada');
      }

      const checkIn = new Date(startDate);
      const checkOut = new Date(endDate);

      const available = await this.isDateAvailable(checkIn, checkOut);
      if (!available) {
        throw new BadRequestException('Las fechas seleccionadas no están disponibles');
      }

      const contract = new Contract();
      contract.startDate = checkIn;
      contract.endDate = checkOut;
      contract.guests = guests;
      contract.pet = pet;
      contract.minor = minor;
      contract.property_ = property;
      contract.account_ = account;
      const createdContract = await this.contractDB.save(contract);
      return createdContract
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('No se pudo generar el contrato');
    }
  }

  async updateContract(contractId: string) {
    const contract = await this.contractDB
    .createQueryBuilder()
    .update(Contract)
    .set({status: ContractStatus.ACEPTED})
    .where( 'id = :contractId', {contractId})
    .execute(
    )
    const uodatedContract = await this.getContractById(contractId)
    return uodatedContract
  }
}
