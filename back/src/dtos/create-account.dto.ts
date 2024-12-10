import { IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength, Validate } from "class-validator";
import { MatchPassword } from "src/decorators/matchPassword.decorator";
import { Roll } from "src/enums/account";

export class CreateAccountDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    userName: string
    
    @IsNotEmpty()
    @MinLength(8)
    @IsString()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,15}$/, 
        { message: "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character [!@#$%^&*]. It must be between 8 and 15 characters long." }
    )
    password: string;

    @Validate(MatchPassword, ["password"])
    comfirmPassword: string
    
    @IsEnum(Roll)
    roll: Roll = Roll.USER

}


