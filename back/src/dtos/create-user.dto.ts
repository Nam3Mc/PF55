import { 
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  Validate
} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { CivilStatus, EmploymentStatus } from "../enums/user";
import { MatchPassword } from "../decorators/matchPassword.decorator";
import { Role } from "../enums/account";
import { Transform, Type } from "class-transformer";

export class CreateUserDto {
  @ApiProperty({ example: "John", description: "First name of the user" })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: "Doe", description: "Last name of the user" })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({ example: "johndoe@example.com", description: "Email of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "1234567890", description: "Phone number of the user" })
  @IsNotEmpty()
  @IsInt()
  phone: number;

  @ApiProperty({ example: "American", description: "Nationality of the user" })
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @ApiProperty({ example: "12345678", description: "Unique DNI of the user" })
  @IsNotEmpty()
  @IsInt()
  dni: number;

  @ApiProperty({ example: "1990-01-01", description: "Date of birth of the user (YYYY-MM-DD)", type: "string", format: "date" })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  DOB: Date;

  @ApiProperty({ example: CivilStatus.SINGLE, enum: CivilStatus, description: "Civil status of the user" })
  @IsNotEmpty()
  @IsEnum(CivilStatus)
  civilStatus: CivilStatus;

  @ApiProperty({ example: EmploymentStatus.EMPLOYED, enum: EmploymentStatus, description: "Employment status of the user" })
  @IsNotEmpty()
  @IsEnum(EmploymentStatus)
  employmentStatus: EmploymentStatus;

  @ApiProperty({ example: true, description: "Status of the user" })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: "john_doe", description: "Username of the user" })
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  userName: string;

  @ApiProperty({ 
    example: "StrongPass1!", 
    description: "Password with at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(15)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, 
      { message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]. It must be between 8 and 15 characters long." }
  )
  password: string;

  @ApiProperty({ example: "StrongPass1!", description: "Confirmation of the password" })
  @IsNotEmpty()
  @Validate(MatchPassword, ["password"])
  comfirmPassword: string;

  @ApiProperty({ example: Role.USER, enum: Role, description: "Role of the user" })
  @IsEnum(Role)
  role: Role = Role.USER;
}
