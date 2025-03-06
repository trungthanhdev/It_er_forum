import { IsString } from "class-validator";
import { Sign } from "crypto";

export class UserDto{
    @IsString()
    user_id: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string

    @IsString()
    status: string
}