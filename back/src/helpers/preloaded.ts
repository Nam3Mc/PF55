import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { AccountService } from "../modules/account/account.service";
import { PropertyService } from "../modules/property/property.service";
import { UserService } from "../modules/user/user.service";
import { User } from "../entities/user.entity";
import { CivilStatus } from "../enums/user";
import { EmploymentStatus } from "../enums/user";
import { Account } from "../entities/account.entity";
import * as bcrypt from 'bcrypt';
import { Role } from "../enums/account";
import * as fs from 'fs';
import { Property } from "../entities/property.entity";
import { ImageService } from "../modules/image/image.service";
import { AmenitiesDto } from "../dtos/amenities.dto";
import { AmenitiesService } from "../modules/amenities/amenities.service";

@Injectable()
export class propertiesSeeder implements OnApplicationBootstrap {
    constructor (
        private readonly userDB: UserService,
        private readonly accountDB: AccountService,
        private readonly propertyDB: PropertyService,
        private readonly imageDB: ImageService,
        private readonly amenitiesDB: AmenitiesService
    ){}
    async onApplicationBootstrap() {
        await this.seedDB()
    }
    
    private async seedDB() {
        const user = await this.userDB.getAllUser()
        if (!user) {
            const newUser = new User
            newUser.name = "John"
            newUser.lastName = "Doe"
            newUser.email = "johndoe@example.com"
            newUser.phone = 1234567890
            newUser.dni = 12345678
            newUser.nationality = "American"
            newUser.DOB = new Date("1990-01-01")
            newUser.civilStatus = CivilStatus.SINGLE
            newUser.employmentStatus = EmploymentStatus.EMPLOYED
            newUser.photo = "https://example.com/photo.jpg"
            const createdUser = await this.userDB.createNewUser(newUser)

            const password = "User1234!"
            const hashedPassword = await bcrypt.hash(password, 10);
            const newAccount = new Account
            newAccount.password = hashedPassword
            newAccount.role = Role.OWNER
            newAccount.user_ = createdUser
            const creadedAccount = await this.accountDB.createNewAccount(newAccount)

            const filePath = '../helpers/properties.json'
            const fileContent = fs.readFileSync(filePath, "utf8")
            const properties = JSON.parse(fileContent)

            for (const property of properties ) {
                const {
                    titel, price, description, state,
                    city, bedrooms, bathrooms, capacity,
                    latitude, longitude, hasMinor, pets,
                    images, wifi, tv, airAcconditioning,
                    piscina, parqueadero, kitchen } = property

                const newProperty = new Property
                newProperty.name = titel
                newProperty.price = price
                newProperty.description = description
                newProperty.state = state
                newProperty.city = city
                newProperty.bedrooms = bedrooms
                newProperty.bathrooms = bathrooms
                newProperty.capacity = capacity
                newProperty.longitude = longitude
                newProperty.latitude = latitude
                newProperty.hasMinor = hasMinor
                newProperty.pets = pets
                const createdProperty = await this.propertyDB.createNewProperty(newProperty)
                const propertyPictures = await this.imageDB.savePicture(createdProperty, images)
                
                const newAmenities = new AmenitiesDto
                newAmenities.airAcconditioning = airAcconditioning
                newAmenities.tv = tv
                newAmenities.kitchen = kitchen
                newAmenities.wifi = wifi
                newAmenities.parqueadero = parqueadero
                newAmenities.piscina = piscina
                const propertyAmenities = await this.amenitiesDB.setAmenities(newAmenities, createdProperty)
            }
        }

    }
}