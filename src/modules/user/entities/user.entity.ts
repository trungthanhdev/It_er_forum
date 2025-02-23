import { MaxLength } from "class-validator";
import { Roles } from "global/enum.global";
import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({name: "users"})
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    user_id : string

    @Column()
    @MaxLength(20)
    first_name: string

    @Column()
    @MaxLength(20)
    last_name: string

    @Column()
    @MaxLength(20)
    user_name: string

    @Column()
    @MaxLength(30)
    email: string

    @Column()
    @MaxLength(61)
    password: string

    @Column()
    @MaxLength(11)
    phone_num: number

    @Column()
    @MaxLength(20)
    country: string

    @Column()
    dob: Date

    @Column({default: Roles.USER})
    @MaxLength(10)
    role: Roles
}


