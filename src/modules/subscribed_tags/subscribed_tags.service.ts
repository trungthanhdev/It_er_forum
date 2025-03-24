import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { Repository } from 'typeorm';
import { TagEntity } from '../tag/entities/tag.entity';
import { TagByService } from '../tag_by/tag_by.service';

@Injectable()
export class SubscribedTagsService {
    constructor(
        @InjectRepository(SubscribedTag)
        private readonly subscribedTagRepo : Repository<SubscribedTag>,
        private readonly tagedByService: TagByService
    ){}

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

    private async calculateTrendingTag(tag: TagEntity){

    }
}
