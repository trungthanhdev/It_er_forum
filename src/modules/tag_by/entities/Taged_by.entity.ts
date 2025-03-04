import { Post } from "src/modules/post/entities/post.entity";
import { TagEntity } from "src/modules/tag/entities/tag.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "taged_by"})
export class TagedByEntity{
    @PrimaryGeneratedColumn("uuid")
    taged_by_id : string

    @ManyToOne(() => Post, (post) => {post.taged_bys})
    @JoinColumn({name : "post_id"})
    post: Post

    @ManyToOne(() => TagEntity, (tag) => {tag.taged_bys})
    @JoinColumn({name : "tags_id"})
    tag: TagEntity
}