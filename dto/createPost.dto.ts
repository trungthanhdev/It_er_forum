import { IsEnum, IsNotEmpty, IsString } from "class-validator"
import { TagName } from "global/enum.global"
import { User } from "src/modules/user/entities/user.entity"

export class CreatePost{
    @IsNotEmpty()
    post_title: string 

    post_content: string

    @IsString()
    img_url: string[]

    @IsEnum(TagName, {each: true})
    tags: TagName[]
}