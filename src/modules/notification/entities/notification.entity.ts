import { MaxLength } from "class-validator";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "notifications"})
export class NotificationEntity{
    @PrimaryGeneratedColumn("uuid")
    notification_id: string

    @Column()
    @MaxLength(20)
    header: string

    @Column()
    content: string

    @CreateDateColumn()
    date_sent: Date

    @ManyToOne(() => User, (user) => {user.notifications})
    @JoinColumn({name: "user_id"})
    user: User
}