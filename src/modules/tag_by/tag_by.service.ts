import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagedByEntity } from './entities/Taged_by.entity';
import { Repository } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { TagEntity } from '../tag/entities/tag.entity';

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
}
