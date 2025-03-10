import { IsString } from "class-validator";
import { User } from "src/modules/user/entities/user.entity";

export class BlacklistDto{
    @IsString()
    token_id?: string

    // @IsString()
    // user_id?: User
}