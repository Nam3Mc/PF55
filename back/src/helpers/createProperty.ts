import { Amenities } from "../entities/amenitie.entity";
import { CreatePropertyDto } from "../dtos/create-property.dto";
import { Property } from "../entities/property.entity";
import { Account } from "../entities/account.entity";
import { typeDeterminer } from "./typeDeterminer";
import { PropertyStatus } from "../enums/property";
import { normalizeString } from "./wordsConverter";

export const propertyCreator = (propertyData: CreatePropertyDto, account: Account) => {
    const {
        name, price, description,
        state, city, bedrooms, bathrooms, capacity,
        latitude, longitude, hasMinor, country,
        pets, wifi, cocina, tv, address,
        parqueadero, piscina, airConditioning, type
    } = propertyData;

    const stateS = normalizeString(state)
    const cityS = normalizeString(city)
    const countryS = normalizeString(country)
    
    const tp = typeDeterminer(type)
    const amenities = new Amenities();
    amenities.airConditioning = airConditioning;
    amenities.tv = tv;
    amenities.cocina = cocina;
    amenities.wifi = wifi;
    amenities.parqueadero = parqueadero;
    amenities.piscina = piscina;
      
    const newProperty = new Property();
    newProperty.name = name
    newProperty.price = price
    newProperty.description = description
    newProperty.state = stateS
    newProperty.city = cityS
    newProperty.country = countryS ?? null
    newProperty.address = address ?? `${stateS}, ${cityS}, ${countryS}`
    newProperty.capacity = capacity
    newProperty.bedrooms = bedrooms
    newProperty.bathrooms = bathrooms
    newProperty.latitude = latitude
    newProperty.longitude = longitude
    newProperty.hasMinor = hasMinor
    newProperty.pets = pets
    newProperty.account_ = account
    newProperty.isActive = PropertyStatus.PENDING
    newProperty.rating = 5
    newProperty.amenities_ = amenities
    newProperty.type = tp

    return newProperty

}