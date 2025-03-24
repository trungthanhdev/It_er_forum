import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';
import { TagByService } from '../tag_by/tag_by.service';

@Injectable()
export class SubscribedTagsService {
    constructor( 
        @InjectRepository(SubscribedTag)
        private readonly subscribedTagRepo: Repository<SubscribedTag>,
        // private readonly userService: UserService
        private readonly tagService: TagService,
        private readonly tagedByService: TagByService
    ){}

    async subscribeTagDefault(user: User){
        let tags = [
            "Framework",
            "Programming language",
            "Technology",
            "News"
        ]
        for(const t of tags){
            let tag = await this.tagService.findOneTag(t)
            if(!tag){
                throw new NotFoundException("invalid")
            }
            let defaults = this.subscribedTagRepo.create({user, tag: tag})
            await this.subscribedTagRepo.save(defaults)
        }
        return
    }

    async getUserSubscribedTag(user_id:string) : Promise<any[]>{
        // console.log(user_id);
        const subscribed_tags : SubscribedTag[] = await this.subscribedTagRepo.find(
            {where: {user: {user_id: user_id}},
            relations: ['tag']});
        
        let res_subscribed_tags : any[] = [];
        for (let index = 0; index < subscribed_tags.length; index++) {
            let element = subscribed_tags[index];
            let sub_tag = {
                tag_id: element.tag.tag_id,
                tag_title: element.tag.tag_name,
                post_count: await this.tagedByService.getNumberOfPost(element.tag.tag_id)
            };
            res_subscribed_tags.push(sub_tag);
            
        }
        return res_subscribed_tags;
        // return [];
    }

    async subscribeTag(tag_id: string, user: User){
        let tag = await this.tagService.findOneTagById(tag_id)
        if(!tag){
            throw new NotFoundException("Tag not found!")
        }
        const subscribeTag = this.subscribedTagRepo.create({tag,user})
        await this.subscribedTagRepo.save(subscribeTag)
        return {}
    }

    private async calculateTrendingTag(tag: TagEntity){

    }
}


