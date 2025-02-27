import { IsEmail, IsNotEmpty, MaxLength } from "class-validator"

export class LoginDto{
    @IsEmail()
    @MaxLength(30)
    @IsNotEmpty({message: "Email is empty!"})
    email : string

    @IsNotEmpty({message: "Password is empty!"})
    password: string
}