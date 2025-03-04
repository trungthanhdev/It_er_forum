import { MaxLength } from "class-validator";
import { TagCategory, TagName } from "global/enum.global";
import { TagedByEntity } from "src/modules/tag_by/entities/Taged_by.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name : "tags"})
export class TagEntity{
    @PrimaryGeneratedColumn("uuid")
    tag_id: string

    @Column()
    @MaxLength(20)
    tag_name: TagName

    @Column()
    tag_category: TagCategory

    @Column()
    tag_description:string

    @OneToMany(() => TagedByEntity, (taged_by) => {taged_by.tag})
    taged_bys : TagEntity[]
}