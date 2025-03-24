import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { TagEntity } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class SubscribedTagsService {
    constructor( 
        @InjectRepository(SubscribedTag)
        private readonly sbRepo: Repository<SubscribedTag>,
        // private readonly userService: UserService
        private readonly tagService: TagService
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
            let defaults = this.sbRepo.create({user, tag: tag})
            await this.sbRepo.save(defaults)
        }
        return
    }
}


