import { IsEmail, IsNumber, IsString } from "class-validator"

export class ResCurrentUserDto{
    @IsString()
    user_id: string

    @IsString()
    first_name: string

    @IsString()
    last_name: string

    @IsString()
    user_name: string

    @IsEmail()
    email: string 

    @IsString()
    phone_num: string

    @IsNumber()
    age: number

    @IsString()
    ava_img_path: string

}