import { IsEnum } from "class-validator";
import { PostStatus } from "global/enum.global";


export class UpdatePostStatusDto {
  @IsEnum(PostStatus, { message: "Invalid status value" })
  status: PostStatus
}
