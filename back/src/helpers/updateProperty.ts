import { Property } from "../entities/property.entity";
import { UpdatePropertyDto } from "../dtos/updateProperty.dto";

export const updateProperty = (propertyData: UpdatePropertyDto, property: Property) => {
    const { name, price, description, state, city, capacity,
        bedrooms, bathrooms, hasMinor, pets, wifi, address, 
        piscina, parqueadero, cocina, tv, airConditioning, country
    } = propertyData
    
    console.log(property.amenities_[1] = wifi ?? property.amenities_[1].wifi)

    property.name = name ?? property.name
    property.price = price ?? property.price
    property.description = description ?? property.description
    property.state = state ?? property.state
    property.city = city ?? property.city
    property.country = country ?? null
    property.address = address ?? `${state}, ${city}, ${country}`
    property.capacity = capacity ?? property.capacity
    property.bedrooms = bedrooms ?? property.bedrooms
    property.bathrooms = bathrooms ?? property.bathrooms
    property.hasMinor = hasMinor ?? property.hasMinor
    property.pets = pets ?? property.pets
    property.amenities_.wifi = wifi ?? property.amenities_.wifi
    property.amenities_.tv = tv ?? property.amenities_.tv
    property.amenities_.airConditioning = airConditioning ?? property.amenities_.airConditioning
    property.amenities_.piscina = piscina ?? property.amenities_.piscina
    property.amenities_.parqueadero = parqueadero ?? property.amenities_.parqueadero
    property.amenities_.cocina = cocina ?? property.amenities_.cocina 


    return property
}