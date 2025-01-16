import { 
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
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
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: "johndoe@example.com", description: "Email of the user" })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: "1234567890", description: "Phone number of the user" })
  @Transform(({ value }) => value === "" ? undefined : value)
  @IsOptional()
  @IsInt()
  phone?: number;

  @ApiProperty({ example: "American", description: "Nationality of the user" })
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty({ example: "12345678", description: "Unique DNI of the user" })
  @Transform(({ value }) => value === "" ? undefined : value)
  @IsOptional()
  @IsInt()
  dni?: number;

  @ApiProperty({ example: "1990-01-01", description: "Date of birth of the user (YYYY-MM-DD)", type: "string", format: "date" })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  DOB: Date;

  @ApiProperty({ example: CivilStatus.SINGLE, enum: CivilStatus, description: "Civil status of the user" })
  @Transform(({ value }) => value === "" ? undefined : value)
  @IsOptional()
  @IsEnum(CivilStatus)
  civilStatus?: CivilStatus;

  @ApiProperty({ example: EmploymentStatus.EMPLOYED, enum: EmploymentStatus, description: "Employment status of the user" })
  @Transform(({ value }) => value === "" ? undefined : value)
  @IsOptional()
  @IsEnum(EmploymentStatus)
  employmentStatus?: EmploymentStatus;

  @ApiProperty({ example: true, description: "Status of the user" })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ example: "https://example.com/photo.jpg", description: "Photo of the user", required: false })
  @Transform(({ value }) => value === "" ? undefined : value)
  @IsOptional()
  @IsUrl()
  photo?: string;

  @ApiProperty({ 
    example: "StrongPass1!", 
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({ example: "StrongPass1!", description: "Confirmation of the password" })
  @IsOptional()
  @IsString()
  @Validate(MatchPassword, ["password"])
  confirmPassword?: string;

  @ApiProperty({ example: Role.USER, enum: Role, description: "Role of the user" })
  @IsEnum(Role)
  role: Role = Role.USER;
}
