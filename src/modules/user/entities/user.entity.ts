import { MaxLength } from "class-validator";
import { Roles } from "global/enum.global";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Exclude } from 'class-transformer';
import { Post } from "src/modules/post/entities/post.entity";
import { Report } from "src/modules/report/entities/report.entity";
import { Comment } from "src/modules/comment/entities/comment.entity";
import { NotificationEntity } from "src/modules/notification/entities/notification.entity";
import { InvalidTokenEntity } from "src/modules/blacklist/entities/refreshtoken.entity";
@Entity({name: "users"})
@Unique(["email"])
export class User {
    @PrimaryGeneratedColumn("uuid")
    @Exclude()
    user_id : string

    @Column({nullable: true})
    @MaxLength(20)
    first_name: string

    @Column({nullable: true})
    @MaxLength(20)
    last_name: string

    @Column()
    @MaxLength(20)
    user_name: string

    @Column()
    @MaxLength(30)
    email: string

    @Column()
    @Exclude()
    @MaxLength(61)
    password: string

    @Column({nullable: true})
    @MaxLength(11)
    phone_num: string

    @Column()
    @MaxLength(20)
    country: string

    @Column()
    dob: Date

    // @Column({nullable: true, default: null})
    // refresh_token: string

    @Column({default: Roles.ADMIN})
    @Exclude()
    @MaxLength(10)
    role: Roles

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[] 

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[]

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[]
    
    @OneToMany(() => NotificationEntity, (notification) => notification.user)
    notifications: NotificationEntity[]
    
    @OneToMany(() => InvalidTokenEntity, (invalidToken) => invalidToken.user)
    invalidated_tokens: NotificationEntity[]
}



