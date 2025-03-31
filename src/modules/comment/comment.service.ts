import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { isUUID } from 'class-validator';
import { UserService } from '../user/user.service';
import { PostService } from '../post/post.service';
import { PostStatus } from 'global/enum.global';
@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepo: Repository<Comment>,
        private readonly userService: UserService,
        private readonly postService: PostService
    ){}
    async findComment(comment_id?: string){
        if (!isUUID(comment_id)) {
              throw new BadRequestException("Invalid comment_id format!");
        }
        return await this.commentRepo.findOne({where: {comment_id: comment_id}})
    }
    async createComment(user_id: string, comment_content: string, post_id: string, comment_parent_id?: string) : Promise<Comment>{
        if(!isUUID(user_id || post_id)) {
            throw new BadRequestException("Invalid user_id or post_id format!");
        }
        const user = await this.userService.findUserById(user_id)
        const post = await this.postService.getPostByPostId(post_id)
        if(!user){
            throw new NotFoundException("User not found!")
        }
        if(!post || post.status !== PostStatus.APPROVED){
            throw new NotFoundException("Post not found!")
        }
        let parent_comment : Comment | null = await this.findCommentById(comment_parent_id)
        let comment = this.commentRepo.create({
            user,
            post,
            comment_content: comment_content,
            comment_parent: parent_comment || undefined,
            date_comment: new Date()
        })
        return await this.commentRepo.save(comment)
    }

    async findCommentById(comment_id?: string){
        console.log(comment_id);
        if (!comment_id){
            return null
        }
        let comment =  await this.commentRepo.findOne({where: {comment_id: comment_id}})
        if(!comment){
          throw new NotFoundException("Comment not found!")
        }
        return comment
    }

    getNumberCommentByPost(post_id: string) : Promise<number>{
        return this.commentRepo.count({where: {post: {post_id}}})
    }
}

// 2. get number comment by post argument(post_id)