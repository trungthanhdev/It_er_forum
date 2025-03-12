import { IsArray, IsBoolean, IsDate, IsString } from "class-validator"

export class PostNSFWDto{
    @IsString()
    user_id: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string

    @IsString()
    post_id: string

    @IsString()
    post_title: string

    @IsBoolean()
    is_image: boolean

    @IsArray()
    tags: string[]

    @IsDate()
    date_updated: Date

    @IsString()
    status: string
  
}