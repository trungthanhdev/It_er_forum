import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { ReqComment } from 'dto/reqComment.dto';
import { JwtAuthGuard } from 'guard/jwt.guard';

@Controller('api/v1/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create-comment')
  @UseGuards(JwtAuthGuard)
  createComment(@Body() commentDto: ReqComment, @Req() req) {
    return this.commentService.createComment(
      req.user['user_id'],
      commentDto.comment_content,
      commentDto.post_id,
      commentDto.comment_parent_id,
    );
  }

  @Get('/count-post-comment/:post_id')
  getNumberCommentByPost(@Param('post_id') post_id: string) {
    return this.commentService.getNumberCommentByPost(post_id);
  }
}
