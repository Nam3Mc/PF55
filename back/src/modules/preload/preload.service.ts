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
import { PropertyStatus } from '../../enums/property';

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
    newUser.email = 'user@email.com';
    newUser.phone = 12345678901;
    newUser.dni = 123456789;
    newUser.nationality = 'American';
    newUser.DOB = new Date('1990-01-01');
    newUser.civilStatus = CivilStatus.SINGLE;
    newUser.employmentStatus = EmploymentStatus.EMPLOYED;
    newUser.photo = 'https://example.com/photo.jpg';
    const createdUser = await this.userDB.createNewUser(newUser);
    const userPassword = 'User1234!';
    const userHashedPassword = await bcrypt.hash(userPassword, 10);
    const userNewAccount = new Account();
    userNewAccount.password = userHashedPassword;
    userNewAccount.role = Role.USER;
    userNewAccount.user_ = createdUser;
    await this.accountDB.createNewAccount(userNewAccount);

    const newUserAdmin = new User();
    newUserAdmin.name = 'John';
    newUserAdmin.lastName = 'Doe';
    newUserAdmin.email = 'admin@email.com';
    newUserAdmin.phone = 123456789012;
    newUserAdmin.dni = 1234567890;
    newUserAdmin.nationality = 'American';
    newUserAdmin.DOB = new Date('1990-01-01');
    newUserAdmin.civilStatus = CivilStatus.SINGLE;
    newUserAdmin.employmentStatus = EmploymentStatus.EMPLOYED;
    newUserAdmin.photo = 'https://example.com/photo.jpg';
    const createdAdminUser = await this.userDB.createNewUser(newUserAdmin);
    const adminPassword = 'User1234!';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    const newAdminAccount = new Account();
    newAdminAccount.password = adminHashedPassword;
    newAdminAccount.role = Role.ADMIN;
    newAdminAccount.user_ = createdAdminUser;
    await this.accountDB.createNewAccount(newAdminAccount);

    const newUserOwner = new User();
    newUserOwner.name = 'John';
    newUserOwner.lastName = 'Doe';
    newUserOwner.email = 'owner@email.com';
    newUserOwner.phone = 123456789;
    newUserOwner.dni = 1234567;
    newUserOwner.nationality = 'American';
    newUserOwner.DOB = new Date('1990-01-01');
    newUserOwner.civilStatus = CivilStatus.SINGLE;
    newUserOwner.employmentStatus = EmploymentStatus.EMPLOYED;
    newUserOwner.photo = 'https://example.com/photo.jpg';
    const createdOwnerUser = await this.userDB.createNewUser(newUserOwner);
    const Ownerpassword = 'User1234!';
    const OwnerhashedPassword = await bcrypt.hash(Ownerpassword, 10);
    const OwnernewAccount = new Account();
    OwnernewAccount.password = OwnerhashedPassword;
    OwnernewAccount.role = Role.OWNER;
    OwnernewAccount.user_ = createdOwnerUser;
    const createdAccount = await this.accountDB.createNewAccount(OwnernewAccount);

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
        title, price, description, state, country,
        city, bedrooms, bathrooms, capacity, latitude,
        longitude, hasMinor, pets, images, wifi, tv,
        airConditioning, piscina, parqueadero, cocina,
      } = property;

      
      const newProperty = new Property
      newProperty.isActive = PropertyStatus.PENDING
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
