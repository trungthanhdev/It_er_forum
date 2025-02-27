import { IsEmail, MaxLength, IsNotEmpty, IsDate, IsNumber,IsOptional } from "class-validator"

export class RegisterDto {
    @IsEmail()
    @MaxLength(30)
    @IsNotEmpty({message: "Email is empty!"})
    email: string

    @IsNotEmpty({message: "Password is empty!"})
    password: string

    @IsNotEmpty({message: "User name is empty!"})
    @MaxLength(50)  
    user_name: string

    @MaxLength(20)
    first_name: string

    @MaxLength(20)
    last_name: string
    
    @IsNumber()
    phone_num: number
    
    @IsNotEmpty({message: "Country is empty!"})
    @MaxLength(20)
    country: string
    
    @IsNotEmpty({message: "Birthday is empty!"})
    @IsDate()
    dob: Date
}


