import { IsString } from "class-validator";

export class BlacklistDto{
    @IsString()
    refreshtoken_id?: string

    // @IsString()
    // user_id?: string
}