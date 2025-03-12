import { Controller, Get, Body, Patch, Param, UsePipes, ValidationPipe, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { PostService } from './post.service';
import { PostStatus } from 'global/enum.global';
import { RoleGuard } from 'guard/role.guard';
import { AuthGuard } from 'guard/auth.guard';
import { NSFWFilteredInterceptor } from 'interceptor/filterNSFW.interceptor';

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
  @UseInterceptors(NSFWFilteredInterceptor)
  getPostAfterNSFWFiltered(){
    return this.postService.getPostAfterNSFWFiltered()
  }

  @Get("/admin/dashboard/:id")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  getPostDetailAfterNSFWFiltered(@Param("id") id: string){
    return this.postService.getPostDetailAfterNSFWFiltered(id)
  }
}
