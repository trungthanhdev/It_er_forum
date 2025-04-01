import { Post } from "src/modules/post/entities/post.entity";
import { TagEntity } from "src/modules/tag/entities/tag.entity";
import { User } from "src/modules/user/entities/user.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SubscribedTag{
    @PrimaryGeneratedColumn("uuid")
    subscribed_tag_id: string

    @CreateDateColumn()
    time_stamp: Date

    @ManyToOne(() => User,(user) => user.subscribed_tags)
    @JoinColumn({name: "user_id"})
    user: User

    @ManyToOne(() => TagEntity, (tag) => tag.subscribed_tags)
    @JoinColumn({name: "tag_id"})
    tag: TagEntity

    @BeforeInsert()
    setVietnamTime() {
        this.time_stamp = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" }));
    }
}