import { Property } from "../entities/property.entity"
import { CreateContractDto } from "../dtos/create-contract.dto"
import { Account } from "../entities/account.entity"
import { Contract } from "../entities/contract.entity"
import { BadGatewayException } from "@nestjs/common"

export const reservationCreator = (contractData: Partial<CreateContractDto>, property: Property, account: Account) => {
    const { startDate, endDate, guests, pet, minor } = contractData
    const checkIn = new Date(startDate)
    const checkOut = new Date(endDate)
    if (guests > property.capacity) {
        throw new BadGatewayException("La cantidad de huespedes supera la capacidad de la propiedad")
    }
    else {
        const contract = new Contract();
        contract.startDate = checkIn
        contract.endDate = checkOut
        contract.guests = guests
        contract.pet = pet ?? false
        contract.minor = minor ?? false
        contract.property_ = property
        contract.account_ = account
        return contract
    }

}