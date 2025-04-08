import { IsNumber, IsString } from "class-validator"

export class ResUserDto{
    @IsString()
    user_id: string

    @IsString()
    first_name: string

    @IsString()
    last_name: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string

    @IsString()
    email: string

    @IsString()
    phone_num: string

    @IsNumber()
    age: number

    @IsString()
    status: string 
}