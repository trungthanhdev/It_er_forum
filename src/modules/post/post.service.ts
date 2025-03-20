import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { PostStatus, TagName } from 'global/enum.global';
import { PostNSFWDto } from 'dto/resPostAfterFilterNSFW';
import { resPostNSFWDetailDto } from 'dto/resPostNSFWDetailDto .dto';
import { ResChangePostDto } from 'dto/resChangePostStatus.dto';
import { CreatePost } from 'dto/createPost.dto';
import { UserService } from '../user/user.service';
import { TagByService } from '../tag_by/tag_by.service';
import { TagService } from '../tag/tag.service';
import { ResCreatePost } from 'dto/resCreatePost.dto';
import { UpdatePostDto } from 'dto/updatePost.dto';
import { ResUpdatePost } from 'dto/resUpdatePost.dto';
import { ResPostDetail } from 'dto/resPostDetail.dto';
import { isUUID } from 'class-validator';
import { sensitive_words } from 'src/bad_words';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo : Repository<Post>,
    private readonly userService: UserService,
    private readonly tagedByService: TagByService,
    private readonly tagsService: TagService,
  ){}
  private badWordsArr = sensitive_words 
  private async containNSFW(content: string, sensitiveWordArr: string[]){
      const contentFiltered = content
      return sensitiveWordArr.some(word => new RegExp(`\\b${word}\\b`, "i").test(contentFiltered))
  }

  async findPost(post_id?: string){
    if (!isUUID(post_id)) {
      throw new BadRequestException("Invalid post_id format!");
    }
    return await this.postRepo.findOne({where: {post_id: post_id}})
  }

  async changePostStatus(id : string, status: string){
    let postStatus = (status as any).status
    
    if(!Object.values(PostStatus).includes(postStatus)){
      throw new BadRequestException("Invalid post status!")
    }

    let post = await this.postRepo.findOne({
      where : {post_id : id},
      relations: ["user", "taged_bys", "taged_bys.tag"],
      })
    
    if(!post){
      throw new BadRequestException("Post not found")
    }

    post.status = postStatus

    await this.postRepo.save(post)

    let responsePostDetail = new ResChangePostDto()
    responsePostDetail.user_name = post?.user.user_name,
    responsePostDetail.user_id = post?.user.user_id,
    responsePostDetail.ava_img_path = post?.user.ava_img_path,
    responsePostDetail.post_title = post?.post_title,
    responsePostDetail.post_content = post?.post_content,
    responsePostDetail.img_url = post?.img_url,
    responsePostDetail.date_updated = post?.date_updated,
    responsePostDetail.date_created = post.date_created,
    responsePostDetail.tags = post?.taged_bys.map(tags => {return tags.tag.tag_name})
    responsePostDetail.status = post?.status
    return responsePostDetail
  }

  async getPostAfterNSFWFiltered(){
    let post = await this.postRepo.find({
      where: {status : PostStatus.PENDING},
      relations: ["user", "taged_bys","taged_bys.tag"]
    })
    
    if(!post){
      throw new NotFoundException("Not found post!")
    }

    let resPostArr : PostNSFWDto[] = [] 
    for(const postFiltered of post){
      const isNSFWPost = await this.containNSFW(postFiltered.post_content, this.badWordsArr)
      if(!isNSFWPost){
        let postElement = new PostNSFWDto()
        postElement.user_id = postFiltered.user.user_id,
        postElement.user_name = postFiltered.user.user_name,
        postElement.is_image = Array.isArray(postFiltered.img_url) && postFiltered.img_url.length > 0,
        postElement.ava_img_path = postFiltered.user.ava_img_path,
        postElement.post_title = postFiltered.post_title,
        postElement.tags = postFiltered.taged_bys.map(tags => {return tags.tag.tag_name}),
        postElement.date_updated = postFiltered.date_updated,
        postElement.status = postFiltered.status,
        postElement.post_id = postFiltered.post_id
        resPostArr.push(postElement)
      }
    }

    resPostArr.sort((a,b) => a.date_updated.getTime() - b.date_updated.getTime())

    return resPostArr
  }

  async getPostDetailAfterNSFWFiltered(id: string){
    let post = await this.postRepo.findOne({
      where : {post_id : id},
      relations: ["user", "taged_bys","taged_bys.tag"]
    })
    if(!post){
      throw new NotFoundException("Post not found!")
    }

    let responsePostDetail = new resPostNSFWDetailDto()
    responsePostDetail.user_name = post?.user.user_name,
    responsePostDetail.user_id = post?.user.user_id,
    responsePostDetail.ava_img_path = post?.user.ava_img_path,
    responsePostDetail.post_id = post?.post_id,
    responsePostDetail.post_title = post?.post_title,
    responsePostDetail.post_content = post?.post_content,
    responsePostDetail.img_url = post?.img_url,
    responsePostDetail.date_updated = post?.date_updated,
    responsePostDetail.tags = post?.taged_bys.map(tags => tags.tag.tag_name)
    responsePostDetail.status = post?.status
    return responsePostDetail
  }

  async searchSortPostByStatus(status : PostStatus, sort_by: Date | null, is_ascending: Boolean){
    if(!Object.values(PostStatus).includes(status)){
      throw new BadRequestException(`Invalid status, status must be "Pending" or "Approved" or "Rejected"!`)
    }
    try {
      let filter = await this.postRepo.find({
        where: {status: status},
        relations: ["user", "taged_bys", "taged_bys.tag"],
      })

      try {
        let response = filter.map((post) => {
          let resElement = new PostNSFWDto()
            resElement.user_id = post.user.user_id
            resElement.user_name = post.user.user_name
            resElement.date_updated = post.date_updated
            resElement.ava_img_path = post.user.ava_img_path
            resElement.is_image = Boolean(post.img_url)
            resElement.post_id = post.post_id
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

  async createPost(post: CreatePost, user_id: string){
    const user = await this.userService.findUserById(user_id)
    if(!user){
      throw new NotFoundException("User not found!")
    }
    const newPost = this.postRepo.create({...post,user: user})
    await this.postRepo.save(newPost)

    for(const tagName of post.tags){
      let tag = await this.tagsService.findOneTag(tagName)

      if(!tag){
         let tag = await this.tagsService.addTag(tagName)
         await this.tagedByService.addTagedBy(newPost,tag)
      }else{
        await this.tagedByService.addTagedBy(newPost,tag)
      }  
    }
    
    let resTag = await this.tagedByService.findAllTag(newPost)

    let resPost = new ResCreatePost()
    resPost.user_id = user.user_id
    resPost.user_name = user.user_name
    resPost.ava_img_path = user.ava_img_path
    resPost.post_title = newPost.post_title
    resPost.post_content = newPost.post_content
    resPost.img_url = newPost.img_url
    resPost.date_created = newPost.date_created
    resPost.tags = resTag.map(tag => { return tag.tag.tag_name})
    resPost.status = newPost.status
    return resPost
  }

  async updatePost(post_id: string, post: UpdatePostDto){
    const existedPost = await this.postRepo.findOne({
      where : {post_id: post_id},
      relations: ["taged_bys", "taged_bys.tag"]
    })
    if(!existedPost){
      throw new NotFoundException("Post not found")
    }
    await this.postRepo.update({post_id},post)
    const postAfterUpdate = await this.postRepo.findOne({
      where : {post_id},
      relations: ["taged_bys", "taged_bys.tag", "user"]
    }) 

    if(!postAfterUpdate){
      throw new NotFoundException("Post not found!")
    }

    const resUpdatePost = new ResUpdatePost()
    resUpdatePost.post_title = postAfterUpdate?.post_title
    resUpdatePost.post_content = postAfterUpdate?.post_content
    resUpdatePost.img_url = postAfterUpdate.img_url
    resUpdatePost.date_updated = postAfterUpdate.date_updated,
    resUpdatePost.status = postAfterUpdate.status,
    resUpdatePost.tags = postAfterUpdate.taged_bys.map(tags => tags.tag.tag_name)
    resUpdatePost.user_id = postAfterUpdate.user.user_id
    resUpdatePost.user_name = postAfterUpdate.user.user_name
    resUpdatePost.ava_img_path = postAfterUpdate.user.ava_img_path
    return resUpdatePost
  }

  async getPostDetail(post_id: string){
    const post = await this.postRepo.findOne({
      where: {post_id: post_id},
      relations: ["user", "comments", "taged_bys", "taged_bys.tag", "comments.user" ]
    })
    if(!post){
      throw new NotFoundException("Post not found!")
    }

    let resPostDetail = new ResPostDetail()
    resPostDetail.user_id = post.user.user_id
    resPostDetail.user_name = post.user.user_name
    resPostDetail.ava_img_path = post.user.ava_img_path
    resPostDetail.post_title = post.post_title
    resPostDetail.post_content = post.post_content
    resPostDetail.img_url = post.img_url
    resPostDetail.date_updated = post.date_updated
    resPostDetail.upvote = post.upvote
    resPostDetail.downvote = post.downvote
    resPostDetail.tags = post.taged_bys.map(tags => tags.tag.tag_name)
    resPostDetail.comments = post.comments?.map(comment => ({
      user_id: comment.user.user_id || null,
      user_name: comment.user.user_name || null,
      ava_img_path: comment.user.ava_img_path || null,
      comment_id: comment.comment_id || null,
      date_comment: comment.date_comment || null,
      comment_content: comment.comment_content || null,
      upvote: comment.upvote || null,
      downvote: comment.downvote|| null
    })) 

    return resPostDetail
  }
}


