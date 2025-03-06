import { IsArray, IsBoolean, IsDate, IsString } from "class-validator";

export class SearchSortPostDto{
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

    @IsBoolean()
    is_image: boolean

    @IsDate()
    date_updated: Date

    @IsString()
    status: string
}