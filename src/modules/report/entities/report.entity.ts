import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReportSubject, ReportTitle } from "global/enum.global";
import { User } from "src/modules/user/entities/user.entity";
import { Post } from "src/modules/post/entities/post.entity";
import { Comment } from "src/modules/comment/entities/comment.entity";
@Entity({name : "reports"})
export class Report{
    @PrimaryGeneratedColumn("uuid")
    report_id : string

    @Column()
    report_title: ReportTitle

    @Column()
    report_body: string

    @Column()
    subject: ReportSubject

    @CreateDateColumn()
    date_reported: Date

    @ManyToOne(() => User, (user) => {user.reports})
    @JoinColumn({name : "reported_user_id"})
    user: User

    @ManyToOne(() => Post, (post) => {post.reports},{nullable : true})
    @JoinColumn({name : "post_id"})
    post: Post

    @ManyToOne(() => Comment, (comment) => {comment.reports},{nullable : true})
    @JoinColumn({name: "comment_id"})
    comment: Comment
    
    
}

