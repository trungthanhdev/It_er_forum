import { IsArray, IsDate, IsString } from "class-validator"

export class ResChangePostDto{
    @IsString()
    user_id: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string

    @IsArray()
    tags: string[]

    @IsString()
    post_title: string

    @IsString()
    post_content: string

    @IsArray()
    img_url: string[]

    @IsDate()
    date_created: Date

    @IsDate()
    date_updated: Date

    @IsString()
    status: string
}