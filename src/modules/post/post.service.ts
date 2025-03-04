import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostStatus } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo : Repository<Post>
  ){}

  async changePostStatus(id : string, status: UpdatePostStatusDto){
    let post =  await this.postRepo.findOne({where : {post_id : id}})
    if(!post){
        throw new NotFoundException("Post not found")
    }
    post.status = PostStatus.APPROVED
    return this.postRepo.save(post)
  }
}
