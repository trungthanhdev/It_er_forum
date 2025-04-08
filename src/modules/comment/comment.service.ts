import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { isUUID } from 'class-validator';
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>
    ){}
    async findComment(comment_id?: string){
        if (!isUUID(comment_id)) {
              throw new BadRequestException("Invalid comment_id format!");
        }
        return await this.commentRepo.findOne({where: {comment_id: comment_id}})
    }
}
