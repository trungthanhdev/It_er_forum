import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "blacklist"})
export class RefreshTokenEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({unique : true})
    refreshtoken_id : string
}