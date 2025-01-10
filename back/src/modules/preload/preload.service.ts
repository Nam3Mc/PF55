import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { AccountService } from '../../modules/account/account.service';
import { PropertyService } from '../../modules/property/property.service';
import { UserService } from '../../modules/user/user.service';
import { User } from '../../entities/user.entity';
import { CivilStatus, EmploymentStatus } from '../../enums/user';
import { Account } from '../../entities/account.entity';
import * as bcrypt from 'bcrypt';
import { Role } from '../../enums/account';
import * as fs from 'fs';
import { Property } from '../../entities/property.entity';
import { ImageService } from '../../modules/image/image.service';
import { Amenities } from '../../entities/amenitie.entity';
import { AmenitiesService } from '../amenities/amenities.service';

@Injectable()
export class PreloadServices implements OnApplicationBootstrap {
  constructor(
    private readonly userDB: UserService,
    private readonly accountDB: AccountService,
    private readonly propertyDB: PropertyService,
    private readonly imageDB: ImageService,
    private readonly amenitiesDB: AmenitiesService
  ) {}

  async onApplicationBootstrap() {
    console.log('PreloadServices: onApplicationBootstrap called');
    try {
      await this.seedDB();
    } catch (error) {
      console.error('Error during database seeding:', error.message);
    }
  }

  private async seedDB() {
    console.log('PreloadServices: Seeding database...');
    const users = await this.userDB.getAllUser();
    if (users.length > 0) {
      console.log('Database already seeded.');
      return;
    }

    const newUser = new User();
    newUser.name = 'John';
    newUser.lastName = 'Doe';
    newUser.email = 'johndoe@example.com';
    newUser.phone = 1234567890;
    newUser.dni = 12345678;
    newUser.nationality = 'American';
    newUser.DOB = new Date('1990-01-01');
    newUser.civilStatus = CivilStatus.SINGLE;
    newUser.employmentStatus = EmploymentStatus.EMPLOYED;
    newUser.photo = 'https://example.com/photo.jpg';
    const createdUser = await this.userDB.createNewUser(newUser);

    const password = 'User1234!';
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAccount = new Account();
    newAccount.password = hashedPassword;
    newAccount.role = Role.OWNER;
    newAccount.user_ = createdUser;

   const createdAccount = await this.accountDB.createNewAccount(newAccount);

    const filePath = 'src/helpers/properties.json';
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return;
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const properties = JSON.parse(fileContent);

    for (const property of properties) {
      console.log(property)
      console.log(properties)
      const {
        title, price, description, state, isActive, country,
        city, bedrooms, bathrooms, capacity, latitude,
        longitude, hasMinor, pets, images, wifi, tv,
        airConditioning, piscina, parqueadero, cocina,
      } = property;

      
      const newProperty = new Property
      newProperty.isActive = isActive;
      newProperty.name = title;
      newProperty.price = price;
      newProperty.bedrooms = bedrooms;
      newProperty.bathrooms = bathrooms;
      newProperty.description = description;
      newProperty.state = state;
      newProperty.city = city;
      newProperty.country = country
      newProperty.address = `${city}, ${state}, ${country}`
      newProperty.capacity = capacity;
      newProperty.rating = 5;
      newProperty.hasMinor = hasMinor;
      newProperty.pets = pets;
      newProperty.longitude = longitude;
      newProperty.latitude = latitude;
      newProperty.account_ = createdAccount

      const newAmenities = new Amenities;
      newAmenities.airConditioning = airConditioning;
      newAmenities.tv = tv;
      newAmenities.cocina = cocina;
      newAmenities.wifi = wifi;
      newAmenities.parqueadero = parqueadero;
      newAmenities.piscina = piscina;
      await this.amenitiesDB.setAmenities(newAmenities, newProperty)

      newProperty.amenities_ = newAmenities
      const createdProperty = await this.propertyDB.createNewProperty(newProperty)
      await this.imageDB.savePicture(createdProperty, images);


    }

    console.log('Database seeding completed successfully.');
  }
}
