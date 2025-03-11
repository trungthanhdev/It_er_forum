import { IsArray, IsDate, IsString } from "class-validator"

export class resPostNSFWDetailDto {
    @IsString()
    user_id?: string

    @IsString()
    user_name?: string

    @IsArray()
    ava_img_path?: string

    @IsString()
    post_id?: string

    @IsString()
    post_title?: string

    @IsString()
    post_content?: string

    @IsArray()
    img_url?: string[]

    @IsDate()
    date_updated?: Date

    @IsArray()
    tags?: string[]

    @IsString()
    status?: string
}