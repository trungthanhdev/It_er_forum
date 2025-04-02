import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SubscribedTagsService } from 'src/modules/subscribed_tags/subscribed_tags.service';
import { TagByService } from 'src/modules/tag_by/tag_by.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class StatisticsGateway{
  constructor(
    private readonly userService: UserService,
    private readonly subscribeTagService: SubscribedTagsService,
    private readonly tagByService: TagByService
  ) {}
  @WebSocketServer() server: Server;

//   @Cron('0 0 9 * * *')
  async updateUserGrowth() {
    const payload = await this.calculateUserGrownth();
    await this.server.emit('userGrowth', payload);
    return payload;
  }

//   @Cron('0 0 * * * *') //Mỗi một tiếng chạy một lần (giây - phút - giờ - ngày - tháng - thứ trong tuần)
  async updateTagGrowth(){ 
      //Code here
      console.log("Update Tag Growth");
      //Calculate 
      const response : Map<string,number> = await this.calculateTagGrowth();
      const payload : any = await JSON.parse(JSON.stringify(Object.fromEntries(response)));
      //Emit to admin-side
      await this.server.emit("tagGrowth", payload);
      return payload;
  }

  private async roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  }

  private async calculateUserGrownth() {
    const STANDARD = 100;
    const totalUserByDay = await this.userService.countNewUsersPerDay();
    console.log(totalUserByDay);
    const growth_percentage = await this.roundTo(totalUserByDay / STANDARD, 3);
    return {
      growth_percentage: growth_percentage
    };
  }

  private async calculateTagGrowth() { 
    console.log("Calculate Tag Growth");
    
    type TagGrowthInput = {
        sbm: number,
        np: number,
        toti: number
    }
    const now: Date = new Date(); // Thời gian hiện tại
    const oneHourAgo: Date = new Date(now.getTime() - 60 * 60 * 1000); // Trừ đi 1 giờ

    console.log(oneHourAgo);
    console.log(now);

    //luu vao map (tagName, {sbm, np, toti})
    const mp: Map<string, TagGrowthInput> = new Map()
    let allSubscribedUsers = await this.subscribeTagService.getAllSubscribedTags(oneHourAgo)
    let allPosts = await this.tagByService.getAllTagedBys(oneHourAgo);

    //luu tag vao map
    for(const sb_user of allSubscribedUsers){
        if(!mp.has(sb_user.tag.tag_name)){
            mp.set(sb_user.tag.tag_name,{sbm: 1, np: 0, toti: 0})
        }else{
            const prev = mp.get(sb_user.tag.tag_name)
            if(!prev){
                // console.log("Not Found Prev");
                throw new NotFoundException()
            }
            mp.set(sb_user.tag.tag_name, {sbm: prev?.sbm + 1, np: 0, toti: 0})
        }
    }

    //luu np(post) vao map 
    for(const post of allPosts){
        if(!mp.has(post.tag.tag_name)){
            mp.set(post.tag.tag_name,{sbm: 0, np: 1, toti: post.post.upvote})
        }
        else{
            const element = mp.get(post.tag.tag_name)
            if(!element){
                console.log("Not Found Ele");
                throw new NotFoundException()
            }
            mp.set(post.tag.tag_name, {sbm: element?.sbm, np: element.np + 1, toti: element.toti + post.post.upvote})
        }
        
    }

    await console.log(mp);
    //tra ve map cho fe map<tagname, %>
    //tao map de tra ve
    const tagGrowth: Map<string, number> = new Map()
    for(const [key,value]  of mp){
        const growth = await this.addFormula(value.np,value.sbm,value.toti)
        tagGrowth.set(key,growth)
    }

    await console.log(tagGrowth);
    return tagGrowth
  }

  private async addFormula(sbm: number,np: number, toti: number){
      //Formula: 3*sbm + 2*np + toti (yxz)
    //y: subscribed members (sbm) // lay user dang ki
    //x: number of posts (np) // lay bai post duoc gan nhan
    //z: totat interaction (comments included) //upvote 
    let STANDARD_SBM = 2; 
    let STANDARD_NP = 3; 
    let STANDARD_TOTI = 10;
    const ratio_sbm = await this.roundTo(sbm/STANDARD_SBM, 3)
    const ratio_np = await this.roundTo(np/STANDARD_NP, 3)
    const ratio_toti = await this.roundTo(toti/STANDARD_TOTI, 3)
    return this.roundTo(3*ratio_sbm + 2*ratio_np + ratio_toti, 3)
  }
}