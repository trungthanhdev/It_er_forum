import { MaxLength } from "class-validator";
import { TagCategory, TagName } from "global/enum.global";
import { SubscribedTag } from "src/modules/subscribed_tags/entities/subscribed_tag.entity";
import { TagedByEntity } from "src/modules/tag_by/entities/Taged_by.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "tags"})
export class TagEntity{
    @PrimaryGeneratedColumn("uuid")
    tag_id: string

    @Column({type: 'enum', enum: TagName})
    @MaxLength(20)
    tag_name: TagName

    @Column({type: 'enum', enum: TagCategory,nullable: true, default: "Entertainment"})
    tag_category?: TagCategory

    @Column({ nullable: true, default: "" })
    tag_description:string

    @OneToMany(() => TagedByEntity, (taged_by) => {taged_by.tag})
    taged_bys: TagedByEntity[]

    @OneToMany(() => SubscribedTag, (subscribed_tags) => subscribed_tags.tag)
    subscribed_tags: SubscribedTag[]
}