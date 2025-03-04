import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostStatus, PostStatusAction } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo : Repository<Post>
  ){}

  async changePostStatus(id : string, status: UpdatePostStatusDto, action : PostStatusAction){
    let post = await this.postRepo.findOne({where : {post_id : id}})
    
    if(!post){
      throw new BadRequestException("Post not found")
    }

    switch (action) {
      case PostStatusAction.APPROVED:
        post.status = PostStatus.APPROVED
        return await this.postRepo.save(post)
      case PostStatusAction.REJECTED:
        post.status = PostStatus.REJECTED
        return await this.postRepo.save(post)
      default:
        throw new BadRequestException("Unsupported action");
    }
  }

}


