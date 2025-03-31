import { Controller, Get, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards, Query, UseInterceptors, Post, BadRequestException, Req, UploadedFile, UploadedFiles, Put, Delete } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus, TagName } from 'global/enum.global';
import { RoleGuard } from 'guard/role.guard';
// import { JwtAuthGuard } from 'guard/auth.guard';
import { CreatePost } from 'dto/createPost.dto';
import { UpdatePostDto } from 'dto/updatePost.dto';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { isUUID, validate } from 'class-validator';

@Controller('/api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch("/admin/dashboard/:id")
  @UsePipes(new ValidationPipe)
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
  changePostStatus(
    @Param("id") id : string,
    @Body() status: string){ 
      return this.postService.changePostStatus(id, status)
  }

  @Get("/admin/dashboard/filter")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
  filterPostByStatus(
    @Query("status") status : string,
    @Query("sort_by") sort_by: string,
    @Query("is_ascending") is_ascending: string
  ){
    const modifyStatus = status as PostStatus
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
  @UseGuards(JwtAuthGuard)
  getPostDetailAfterNSFWFiltered(@Param("id") id: string){
    return this.postService.getPostDetailAfterNSFWFiltered(id)
  }

  @Post("/")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('img_file'))
  createPost(@Body() post: CreatePost,@Req() req,@UploadedFiles() img_file?: Express.Multer.File){
    
    if (!Array.isArray(post.tags)) {
      throw new BadRequestException("Tags must be an array!");
    }
    
    const tags = post.tags.filter(tags => Object.values(TagName).includes(tags))
    
    if(tags.length === 0){
      throw new BadRequestException("Invalid TagName!")
    }
    const user_id = req.user["user_id"]
    return this.postService.createPost({ ...post, img_file },user_id)
  }

  @Put("/:id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('img_file'))
  updatePost(@Param("id") post_id: string,
             @Body() updatePost: UpdatePostDto,
             @UploadedFiles() img_file?: Express.Multer.File
  ){
    return this.postService.updatePost(post_id, {...updatePost,img_file})
  }

  @Get("/:id")
  @UseGuards(JwtAuthGuard)
  getPostDetail(@Param("id") post_id: string){
    if(!isUUID(post_id)){
      throw new BadRequestException("Invalid post ID");
    }
    return this.postService.getPostDetail(post_id)
  }

  // @Get("/admin/count-post-remaining")
  // getPostRemaining(){
  //   return this.postService.counPostRemaining()
  // }

  @Get("/user_posts/:user_id")
  @UseGuards(JwtAuthGuard)
  getUserPost(@Param("user_id") user_id : string){
    return this.postService.getPostByUserId(user_id)
  }

  @Delete("delete-post")
  deletePost(){
    return this.postService.deletePost()
  }

  // @Patch("/interact/:id")
  // @UseGuards(JwtAuthGuard)
  // updateInteract(@Param("id") post_id: string,
  //            @Body() updatePost: UpdatePostDto,
  // ){
  //   return this.postService.updateInteraction(post_id, updatePost);
  // }
}