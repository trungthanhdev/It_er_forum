import { IsEmail, MaxLength, IsNotEmpty } from "class-validator"

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
    
    
    @MaxLength(11)
    phone_num: string
    
    @MaxLength(20)
    country: string
    
    dob: Date
}


