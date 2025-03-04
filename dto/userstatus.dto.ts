import { IsEnum } from "class-validator";
import { UserStatus } from "global/enum.global";

export class UpdateUserStatusDto{
    @IsEnum(UserStatus, {message: "User status invalid"})
    status: UserStatus
}