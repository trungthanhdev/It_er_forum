import { IsArray, IsDate, IsNumber, IsString } from "class-validator"

export class ResUpdatePost{
    @IsString()
    post_title: string

    @IsString()
    post_content: string

    @IsArray()
    img_url: string[]

    @IsString()
    user_id: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string


    @IsDate()
    date_updated: Date

    @IsString()
    status: string

    @IsArray()
    tags: string[]
}