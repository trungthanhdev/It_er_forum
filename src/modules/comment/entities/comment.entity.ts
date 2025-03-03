import { Post } from "src/modules/post/entities/post.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "src/modules/report/entities/report.entity";
@Entity({name: "comments"})
export class Comment{
    @PrimaryGeneratedColumn("uuid")
    comment_id: string

    @Column()
    comment_content: string

    @Column()
    upvote: number

    @Column()
    downvote: number

    @ManyToOne(() => User, (user) => {user.comments})
    @JoinColumn({name : "user_id"})
    user: User

    @ManyToOne(() => Post, (post) => {post.comments})
    @JoinColumn({name : "post_id"})
    post: Post

    @OneToMany(() => Report, (report) => {report.comment})
    reports: Report[]

    //moi quan he tu than
    @ManyToOne(() => Comment, (comment) => {comment.replies})
    @JoinColumn({name: "comment_parent_id"})
    comment_parent: Comment

    @OneToMany(() => Comment, (comment) => {comment.comment_parent})
    replies: Comment[]
}

