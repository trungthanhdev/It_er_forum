import { IsEnum, IsNotEmpty, IsOptional } from "class-validator"
import { TagName } from "global/enum.global"
import { User } from "src/modules/user/entities/user.entity"

export class CreatePost{
    @IsNotEmpty()
    post_title: string 

    post_content: string

    // @IsString()
    // img_url: string[]
    @IsOptional()
    img_file?: Express.Multer.File;

    @IsEnum(TagName, {each: true})
    tags: TagName[]
}