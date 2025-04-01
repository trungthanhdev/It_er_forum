import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagedByEntity } from './entities/Taged_by.entity';
import { Between, MoreThanOrEqual, Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { PostStatus, TagName } from 'global/enum.global';

@Injectable()
export class TagByService {
     constructor (
            @InjectRepository(TagedByEntity)
            private readonly taged_byRepo: Repository<TagedByEntity>
        ){}

    addTagedBy(post: Post, tag: TagEntity){
        let tagedByElement = this.taged_byRepo.create({post, tag})
        return this.taged_byRepo.save(tagedByElement)
    }

    findAllTag(post : Post){
        return this.taged_byRepo.find({
            where: {
                post : { post_id : post.post_id }
            }, 
            relations: ["tag"]
        })
    }

    async getNumberOfPost(tag_id:string) : Promise<number>{
        // console.log("Tagby id: " + tag_id);
        let num_posts : number = await this.taged_byRepo.count(
            {where:{
                tag: {tag_id:tag_id},
                post: {status: PostStatus.APPROVED}
            }});
        // console.log("Num post: " + num_posts);
        return num_posts;
    }

    async findTagById(tag_id : string) : Promise<TagedByEntity[]>{
        const tagged_by_posts : TagedByEntity[] = await this.taged_byRepo.find({
            where: {
                tag: {tag_id: tag_id},
                post: {status: PostStatus.APPROVED}
            },
            relations: ["tag", "post"]
        });
        return tagged_by_posts
    }
    
    async getAllTagedBys(oneHourAgo : Date) {
        return this.taged_byRepo.find({
            where:{
                post:{
                    date_updated: MoreThanOrEqual(oneHourAgo),
                    status: PostStatus.APPROVED
                }
            },
            relations: ['post', 'tag'],
        });
      }
}
