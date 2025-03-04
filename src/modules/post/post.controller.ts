import { Controller, Get, Post, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus, PostStatusAction } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';
import { RoleGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';

@Controller('/api/v1/admin')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch("/dashboard/:id")
  @UsePipes(new ValidationPipe)
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  changePostStatus(
    @Param("id") id : string,
    @Body() status: UpdatePostStatusDto,
    @Query("action") action: string){
      const normalizedAction = action.toUpperCase() as PostStatusAction; 
      return this.postService.changePostStatus(id, status,normalizedAction)
  }
}
