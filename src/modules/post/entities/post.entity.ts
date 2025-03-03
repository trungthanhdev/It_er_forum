import { MaxLength } from "class-validator";
import { PostStatus } from "global/enum.global";
import { User } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Report } from "src/modules/report/entities/report.entity";
import { Comment } from "src/modules/comment/entities/comment.entity";
@Entity({name : "posts"})
export class Post {
    @PrimaryGeneratedColumn("uuid")
    post_id: string

    @Column()
    @MaxLength(50)
    post_title: string

    @Column({nullable: true})
    @MaxLength(255)
    post_content: string

    @Column("text",{nullable: true, array: true})
    img_url: string[]

    @CreateDateColumn()
    date_created: Date

    @UpdateDateColumn()
    date_updated: Date

    @Column({ default : 0})
    upvote : number

    @Column({ default : 0})
    downvote : number

    @Column({default: PostStatus.PENDING})
    status: PostStatus

    @ManyToOne(() => User,(user) => user.posts)
    @JoinColumn({name: "user_id"})
    user: User

    @OneToMany(() => Report, (report) => report.post)
    reports: Report[]

    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[]

}
