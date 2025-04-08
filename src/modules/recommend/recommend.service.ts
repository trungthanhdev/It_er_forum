import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { NotificationService } from "../notification/notification.service";
import { UserService } from "../user/user.service";
import { ResNotification } from "dto/resNotification.dto";
import { SubscribedTagsService } from "../subscribed_tags/subscribed_tags.service";
import { User } from "../user/entities/user.entity";
import { ResLayout } from "dto/resLayout.dto";
import { TagService } from "../tag/tag.service";
import { TagEntity } from "../tag/entities/tag.entity";
import { ResTag } from "dto/resTag.dto";
import { ResDetailTag } from "dto/resDetailTag.dto";
import { Post } from "../post/entities/post.entity";
import { ResPostShort } from "dto/resPostShort.dto";
import { PostService } from "../post/post.service";
import { SubscribedTag } from "../subscribed_tags/entities/subscribed_tag.entity";
import { TagedByEntity } from "../tag_by/entities/Taged_by.entity";
import { ResHome } from "dto/resHome.dto";
import { ResPopular } from "dto/resPopular.dto";
import { TagByService } from "../tag_by/tag_by.service";


@Injectable()
export class RecommendService{
    constructor(
        private readonly notificationService: NotificationService,
        private readonly userService: UserService,
        private readonly tagedByService: TagByService,
        private readonly subscribedTagService: SubscribedTagsService,
        private readonly tagService: TagService,
        private readonly postService: PostService,
    ){}

    async getLayout(user_id:string) : Promise<any>{
        const notifications : ResNotification[] = await this.notificationService.getNotificationByUserId(user_id);
        let subscribed_tags : any[] = await this.subscribedTagService.getUserSubscribedTag(user_id);
        const user : User = await this.userService.findUserById(user_id);
        const res_layout = new ResLayout();
        // await this.updateNumberOfTagPosts(subscribed_tags);
        res_layout.username = user.user_name;
        res_layout.ava_img_path = user.ava_img_path;
        res_layout.notifications = notifications;
        res_layout.subscribed_tags = subscribed_tags;
        return res_layout;
    }

    private async getAssociateTag(){
        //Phat trien sau
    }

    async getHome(user_id: string) : Promise<ResHome>{
        const user : User = await this.userService.findUserById(user_id);
        const subscribed_tags : SubscribedTag[] = user.subscribed_tags; //tag_id
        const taged_bys : TagedByEntity[] = [];
        
        console.log(subscribed_tags.length);

        //Tìm các bài được gắn tag
        for (let index = 0; index < subscribed_tags.length; index++) {
            const element = subscribed_tags[index];
            let top_tag : TagedByEntity[] = await this.tagedByService.findTagById(element.tag.tag_id);
            taged_bys.push(...top_tag);
        }

        console.log(taged_bys.length);

        //Quy về thành dạng short post và xoá các bài trùng
        const recommend_posts : ResPostShort[] = await this.listShortPostWithCondition(taged_bys);

        console.log(recommend_posts);

        let res_home = new ResHome();
        //Sort theo tuong tac
        recommend_posts.sort((post_a, post_b) => (post_a.upvote < post_b.upvote || post_a.comments_num < post_b.comments_num) ? 1 : -1);
        res_home.recommend_posts = recommend_posts;
        
        //get recent posts by algorithm
        //Sort theo ngay
        recommend_posts.sort((post_a, post_b) => (post_a.date_updated < post_b.date_updated) ? 1 : -1);
        res_home.recent_posts = recommend_posts;

        return res_home;
    }


    async getPopular(){
        //sort tag by number of posts and take 5
        let trending_tags : ResTag[] = await this.getTags();
        trending_tags.sort((tag_a, tag_b) => (tag_a.num_posts < tag_b.num_posts) ? 1 : -1);
        let top_5_trending_tags = trending_tags.slice(0,5);
        //get trending posts by algorithm
        const taged_bys : TagedByEntity[] = [];

        //Tìm các bài được gắn tag
        for (let index = 0; index < top_5_trending_tags.length; index++) {
            const element = top_5_trending_tags[index];
            let top_tag : TagedByEntity[] = await this.tagedByService.findTagById(element.tag_id);
            taged_bys.push(...top_tag);
        }
        
        // console.log(taged_bys);

        //Quy về thành dạng short post và xoá các bài trùng
        const trending_posts : ResPostShort[] = await this.listShortPostWithCondition(taged_bys);

        //Sort theo tuong tac
        trending_posts.sort((post_a, post_b) => (post_a.upvote > post_b.upvote || post_a.comments_num > post_b.comments_num) ? 1 : -1);

        //Code here
        let res_popular = new ResPopular();
        res_popular.trending_tags = top_5_trending_tags;
        res_popular.trending_posts = trending_posts;
        return res_popular;
    }

    async getTags() : Promise<ResTag[]>{
        const tags : TagEntity[] = await this.tagService.findAllTag();
        let res_tags : ResTag[] = [];
        // console.log("Tag tot: "+tags.length);
        let arr_num_posts : number[] = [];
        for (let index = 0; index < tags.length; index++) {
            const element = tags[index];
            arr_num_posts[index] = await this.tagedByService.getNumberOfPost(element.tag_id);
        }

        for (let index = 0; index < tags.length; index++) { //O(n + n)
            const element = tags[index];
            let res_tag = new ResTag();
            res_tag.tag_id = element.tag_id;
            res_tag.tag_name = element.tag_name;
            res_tag.tag_category = element.tag_category || "";
            res_tag.num_posts = arr_num_posts[index];
            res_tags.push(res_tag);
        }
        // console.log("Res Tag tot: "+res_tags.length)
        return res_tags;
    }

    async getTagDetail(tag_id : string, user_id: string){
        const chosen_tag : TagedByEntity[] = await this.tagedByService.findTagById(tag_id)
        const is_subscribed : boolean = await this.subscribedTagService.isUserSubscribeTag(user_id,tag_id);
        if (!chosen_tag){
            throw new InternalServerErrorException("Null Pointer Exception");
        }
        else{
            let res_tag_detail = new ResDetailTag();
            res_tag_detail.recommend_posts = [];
            //tag information
            if(chosen_tag.length > 0){
                const tag_info : TagEntity = chosen_tag[0].tag;
                res_tag_detail.tag_id = tag_info.tag_id;
                res_tag_detail.tag_name = tag_info.tag_name;
                res_tag_detail.tag_category = tag_info.tag_category || "";
                res_tag_detail.tag_description = tag_info.tag_description;
                res_tag_detail.num_posts = chosen_tag.length;
                res_tag_detail.is_subscribed = is_subscribed;
                res_tag_detail.recommend_posts = await this.listShortPostWithCondition(chosen_tag);
            }
            
            await console.log("Done");
            return res_tag_detail;
        }
    }

    private async listShortPostWithCondition(taged_bys : TagedByEntity[]) : Promise<ResPostShort[]>{
        console.log("In");
        let res_tag_posts: ResPostShort[] = [];
        let distinct_post_id_tracking = new Map<string, boolean>();

        for (let index = 0; index < taged_bys.length; index++) {
            let element = taged_bys[index];
            if(!distinct_post_id_tracking.has(element.post.post_id)){
                let res_short_post : ResPostShort = await this.postService.generateShortPost(element.post.post_id);
                res_tag_posts.push(res_short_post);
                distinct_post_id_tracking.set(element.post.post_id, true);
            }
        }
        res_tag_posts.sort((post_a, post_b) => (post_a.date_updated < post_b.date_updated) ? 1 : -1);
        return res_tag_posts;
    }
}