import { Controller, Get, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards, Query } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus, PostStatusAction } from 'global/enum.global';
import { UpdatePostStatusDto } from 'dto/poststatus.dto';
import { RoleGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';

@Controller('/api/v1/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Patch("/admin/dashboard/:id")
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

  @Get("/admin/dashboard/search")
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
  getPostDetailAfterNSFWFiltered(@Param("id") id: string){
    return this.postService.getPostDetailAfterNSFWFiltered(id)
  }
}
