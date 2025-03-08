import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostStatus, PostStatusAction } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';
import { SearchSortPostDto } from 'dto/resSearchSortPost.dto';
import { map } from 'rxjs';
import { PostNSFWDto } from 'dto/resPostAfterFilterNSFW';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo : Repository<Post>
  ){}

  async changePostStatus(id : string, status: UpdatePostStatusDto, action : PostStatusAction){
    let post = await this.postRepo.findOne({
      where : {post_id : id},
      relations: ["user", "taged_bys", "taged_bys.tag"],
      })
    
    if(!post){
      throw new BadRequestException("Post not found")
    }
    switch (action) {
      case PostStatusAction.APPROVED:
        post.status = PostStatus.APPROVED
        break
      case PostStatusAction.REJECTED:
        post.status = PostStatus.REJECTED
        break
      default:
        throw new BadRequestException("Unsupported action");
    }
    await this.postRepo.save(post)
    return {
      user_id: post.user.user_id,
      user_name: post.user.user_name,
      ava_img_path: post.user.ava_img_path,
      tags: post.taged_bys.map((tags) => {return tags.tag.tag_name}),
      post_title: post.post_title,
      post_content: post.post_content,
      img_url: post.img_url,
      date_created: post.date_created,
      date_updated: post.date_updated,
      status: post.status
    }
  }

  async getPostAfterNSFWFiltered(){
    let post = await this.postRepo.find({
      relations: ["user", "taged_bys"]
    })
    if(!post){
      throw new NotFoundException("Not found post!")
    }
    let response = post.map((post) => {
      let postElement = new PostNSFWDto()
      postElement.user_id = post.user.user_id,
      postElement.user_name = post.user.user_name,
      postElement.is_image = Boolean(post.img_url),
      postElement.ava_img_path = post.user.ava_img_path,
      postElement.post_title = post.post_title,
      postElement.tags = post.taged_bys.map(tags => {return tags.tag.tag_name}),
      postElement.date_updated = post.date_updated,
      postElement.status = post.status,
      postElement.post_id = post.post_id
      return postElement
    })
    response.sort((a,b) => {
      return a.date_updated.getTime() - b.date_updated.getTime()
    })

    return response
  }

  async getPostDetailAfterNSFWFiltered(id: string){
    let post = await this.postRepo.findOne({
      where : {post_id : id},
      relations: ["user", "taged_bys"]
    })
    return {
      user_id: post?.user.user_id,
      user_name: post?.user.user_name,
      ava_img_path: post?.user.ava_img_path,
      post_id: post?.post_id,
      post_title: post?.post_title,
      post_content: post?.post_content,
      img_url: post?.img_url,
      date_updated: post?.date_updated,
      tags: post?.taged_bys.map(tags => {return tags.tag.tag_name}),
      status: post?.status
    }
  }

  async searchSortPostByStatus(status : PostStatus, sort_by: Date | null, is_ascending: Boolean){
    if(!Object.values(PostStatus).includes(status)){
      throw new BadRequestException(`Invalid status, status must be "Pending" or "Approved" or "Rejected"!`)
    }
    try {
      let filter = await this.postRepo.find({
        where: {status: status},
        relations: ["user", "taged_bys"],
      })

      try {
        let response = filter.map((post) => {
          let resElement = new SearchSortPostDto()
            resElement.user_id = post.user.user_id
            resElement.user_name = post.user.user_name
            resElement.date_updated = post.date_updated
            resElement.ava_img_path = post.user.ava_img_path
            resElement.is_image = Boolean(post.img_url)
            resElement.post_title = post.post_title
            resElement.tags = post.taged_bys.map((tags) =>{ return tags.tag.tag_name})
            resElement.status = post.status
            return resElement
        })
        if(sort_by !== null){
          response.sort((a,b) => {
           return is_ascending ? a.date_updated.getTime() - b.date_updated.getTime()
                                     : b.date_updated.getTime() - a.date_updated.getTime()
         })
       }
   
         return response
      } catch (error) {
        throw error
      }
    } catch (error) {
        throw error
    }
  }
}


