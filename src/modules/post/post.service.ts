import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async findAllPost(){
    return await this.postRepo.find()
  }

  async searchSortPostByStatus(status : PostStatus, sort_by: Date | null, is_ascending: Boolean){
    if(!Object.values(PostStatus).includes(status)){
      throw new BadRequestException(`Invalid status, status must be "Pending" or "Approved" or "Rejected"!`)
    }
    try {
      let filter = await this.postRepo.find({
        where: {status: status},
        relations: ["user"],
        select:{
          post_title: true,
          status: true,
          date_updated:true,
            user: {
              user_name: true,
              ava_img_path: true,
              user_id: true
            }
        }
      })

    if(sort_by !== null){
       filter.sort((a,b) => {
        return is_ascending ? a.date_updated.getTime() - b.date_updated.getTime()
                                  : b.date_updated.getTime() - a.date_updated.getTime()
      })
    }

      return filter
    } catch (error) {
        throw error
    }
  }
}


