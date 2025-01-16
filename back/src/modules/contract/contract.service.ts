import { InjectRepository } from "@nestjs/typeorm";
import { Contract } from "../../entities/contract.entity";
import { Repository } from "typeorm";
import { CreateContractDto } from "../../dtos/create-contract.dto";
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { AccountService } from "../account/account.service";
import { ContractStatus } from "../../enums/contract";
import { reservationCreator } from "../../helpers/reservationCreator";
import { Property } from "../../entities/property.entity";

@Injectable()
export class ContractService {

  constructor(
    @InjectRepository(Contract)
    private readonly contractDB: Repository<Contract>,
    private readonly accountDB: AccountService,
  ) {}
  
  async getContracts () {
    const contracts = await this.contractDB.find({
      relations: ['account_', 'account_.user_']
    });
    return contracts
  }

  async userContracts(id: string) {
    try {
      const activatedContracts = await this.contractDB
        .createQueryBuilder('contract')
        .leftJoinAndSelect('contract.account_', 'account')
        .leftJoinAndSelect('contract.property_', 'property')
        .leftJoinAndSelect('property.image_', 'image')
        .where('account.id = :id', { id })
        .andWhere('contract.status = :status', { status: 'aceptado' }) // Corregido aquí
        .andWhere('contract.status != :negociacion', { negociacion: 'negociacion' }) // Evita contratos en negociación
        .getMany();
  
      return activatedContracts;
    } catch (error) {
      console.error("Error al obtener contratos:", error);
      return [];
    }
  }
  async isDateAvailable(checkIn: string, checkOut: string, propertyId: string): Promise<boolean> {
    try {
      const inDay = new Date(checkIn);
      const outDay = new Date(checkOut);
  
      // Validar fechas
      if (isNaN(inDay.getTime()) || isNaN(outDay.getTime())) {
        throw new Error('Las fechas proporcionadas no son válidas');
      }
  
      // Buscar contratos en estado "negociacion" que pertenezcan a la propiedad
      const contracts = await this.contractDB.find({
        where: { 
          status: ContractStatus.ACEPTED, // Solo contratos en negociación
          property_: { id: propertyId },
        },
      });
  
      // Verificar si las fechas están disponibles
      for (const contract of contracts) {
        const contractStart = new Date(contract.startDate);
        const contractEnd = new Date(contract.endDate);
  
        // Verificar solapamiento de fechas
        if (
          (inDay >= contractStart && inDay < contractEnd) || // Check-in dentro del rango
          (outDay > contractStart && outDay <= contractEnd) || // Check-out dentro del rango
          (inDay <= contractStart && outDay >= contractEnd) // Fechas envuelven el contrato
        ) {
          return false; // No disponible
        }
      }
  
      return true; // Disponible si no hay solapamientos
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

  async getPropertyContracts(id: string) {
    try {
      const contracts = await this.contractDB.find({
        where: {
          status: ContractStatus.ACEPTED,
          property_: { id },
        },
      })
      return contracts
    } catch (error) {
      throw new BadRequestException('Nopuedimos encontrar contratos en esta propiedad')
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

  async createContract(contractData: CreateContractDto, givenProperty: Property) {
    const { startDate, endDate, accountId, propertyId } = contractData;
    const property = givenProperty
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
    try {
      const contract = await this.getContractById(contractId)
      contract.status = ContractStatus.ACEPTED
      const updateContract = await this.contractDB.save(contract)
      return updateContract
      
    } catch (error) {
      throw new BadRequestException("No se pudo actualizar el contrato")
    }
  }



}


