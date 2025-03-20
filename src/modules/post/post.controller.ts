import { Controller, Get, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards, Query, UseInterceptors, Post, BadRequestException, Req } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus, TagName } from 'global/enum.global';
import { RoleGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';
import { CreatePost } from 'dto/createPost.dto';
import { UpdatePostDto } from 'dto/updatePost.dto';

@Controller('/api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch("/admin/dashboard/:id")
  @UsePipes(new ValidationPipe)
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  changePostStatus(
    @Param("id") id : string,
    @Body() status: string){ 
      return this.postService.changePostStatus(id, status)
  }

  @Get("/admin/dashboard/filter")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  filterPostByStatus(
    @Query("status") status : string,
    @Query("sort_by") sort_by: string,
    @Query("is_ascending") is_ascending: string
  ){
    const modifyStatus = status.toUpperCase() as PostStatus
    const modifySortBy = sort_by ? new Date(sort_by) : null
    const modifyIsAscending = is_ascending === 'true'
    return this.postService.searchSortPostByStatus(modifyStatus,modifySortBy,modifyIsAscending)

  }

  @Get("/admin/dashboard")
  getPostAfterNSFWFiltered(){
    return this.postService.getPostAfterNSFWFiltered()
  }

  @Get("/admin/dashboard/:id")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  getPostDetailAfterNSFWFiltered(@Param("id") id: string){
    return this.postService.getPostDetailAfterNSFWFiltered(id)
  }

  @Post("/")
  @UseGuards(AuthGuard)
  createPost(@Body() post: CreatePost, @Req() req){
    if (!Array.isArray(post.tags)) {
      throw new BadRequestException("Tags must be an array!");
    }
    
    const tags = post.tags.filter(tags => Object.values(TagName).includes(tags))
    if(tags.length === 0){
      throw new BadRequestException("Invalid TagName!")
    }
    const user_id = req.currentUser.user_id
    return this.postService.createPost(post,user_id)
  }

  @Patch("/:id")
  @UseGuards(AuthGuard)
  updatePost(@Param("id") post_id: string,
             @Body() updatePost: UpdatePostDto
  ){
    return this.postService.updatePost(post_id, updatePost)
  }

  @Get("/:id")
  @UseGuards(AuthGuard)
  getPostDetail(@Param("id") post_id: string){
    return this.postService.getPostDetail(post_id)
  }

}
