import { TypeOfProperty } from "../enums/property";

export const typeDeterminer = (type: string): TypeOfProperty => {
  if (type === "apartamento") {
    return TypeOfProperty.APARTMENT;
  } else if (type === "habitacion") {
    return TypeOfProperty.ROOM;
  } else {
    return TypeOfProperty.HOUSE;
  }
};
