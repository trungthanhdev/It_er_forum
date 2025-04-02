import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { StatisticsGateway } from 'src/socket/statistics.gateway';

@Controller('/api/v1/subscribe-tag')
export class SubscribedTagsController {
  constructor(private readonly subscribeTagsService: SubscribedTagsService, 
    private readonly statisticsGateWay: StatisticsGateway) {}
  
  @Post("/:tag_id")
  @UseGuards(JwtAuthGuard)
  subscribeTag(@Param("tag_id") tag_id: string, @Req() req){
    let user = req.user
    return this.subscribeTagsService.subscribeTag(tag_id,user)
  }

  @Get("/statistics")
  getStatistics(){
    return this.statisticsGateWay.updateTagGrowth();
  }

  @Get("/user-growth")
  getUserGrowth(){
    return this.statisticsGateWay.updateUserGrowth();
  }

}
