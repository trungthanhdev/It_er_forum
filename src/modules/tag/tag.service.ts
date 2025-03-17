import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagEntity } from './entities/tag.entity';
import { Repository } from 'typeorm';
import { TagName } from 'global/enum.global';

@Injectable()
export class TagService {
    constructor (
        @InjectRepository(TagEntity)
        private readonly tagRepo: Repository<TagEntity>
    ){}

    findAllTag(){
        return this.tagRepo.find()
    }

    findOneTag(tagName: string){
        const modifyTagName = tagName as TagName
        return this.tagRepo.findOne({where: {tag_name: modifyTagName}})
    }

    addTag(tag_name: string){
        const modifyTagName = tag_name as TagName
        const tag = this.tagRepo.create({tag_name: modifyTagName})
        return this.tagRepo.save(tag)
    }
}
