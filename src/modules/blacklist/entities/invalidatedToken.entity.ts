import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "invalidated_tokens"})
export class InvalidTokenEntity{
    @PrimaryColumn()
    token_id: string

    
    @CreateDateColumn()
    time_stamp: Date

    @ManyToOne(() => User, (user) => {user.invalidated_tokens})
    @JoinColumn({name: "user_id"})
    user: User
}