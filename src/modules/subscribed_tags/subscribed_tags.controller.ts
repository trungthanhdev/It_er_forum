import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { JwtAuthGuard } from 'guard/jwt.guard';

@Controller('/api/v1/subscribe-tag')
export class SubscribedTagsController {
  constructor(private readonly subscribeTagsService: SubscribedTagsService) {}
  
  @Post("/:tag_id")
  @UseGuards(JwtAuthGuard)
  subscribeTag(@Param("tag_id") tag_id: string, @Req() req){
    let user = req.user
    return this.subscribeTagsService.subscribeTag(tag_id,user)
  }
}
