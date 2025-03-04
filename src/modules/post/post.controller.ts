import { Controller, Get, Post, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';
import { RoleGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';

@Controller('/api/v1/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch("/:id")
  @UsePipes(new ValidationPipe)
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  changePostStatus(@Param("id") id : string,@Body() status: UpdatePostStatusDto){
      return this.postService.changePostStatus(id, status)
  }
}
