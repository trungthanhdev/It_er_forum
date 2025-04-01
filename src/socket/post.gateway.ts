import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
import { UserGateWay } from './user.gateway';
import { NotFoundException, OnModuleInit } from '@nestjs/common';
import { ReportGateway } from './report.gateway';
import { CommentService } from 'src/modules/comment/comment.service';
import { NotificationGatewayService } from './notfication.gateway.service';
import { PostService } from 'src/modules/post/post.service';
import { Post } from 'src/modules/post/entities/post.entity';
import { Comment } from 'src/modules/comment/entities/comment.entity';
  
  @WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })
  export class PostGateway implements OnModuleInit {
    constructor(
      private readonly commentService : CommentService,
      private readonly postService: PostService,
      private readonly notificationGatewayService: NotificationGatewayService
    ){}
    
    @WebSocketServer()
    server: Server;
   
    onModuleInit(){
      this.server.on('connection', (socket) => {
        console.log('User connected');
        let isQueueToNotify : boolean = false;
        socket.on('joinRoomPost', async (post_id) => {
          console.log('User joined room Post');
          socket.join(post_id);
          isQueueToNotify = false;
        });

        //data = {
        //post_id: string
        //user_post_id: string
        //upvote : num (likes after user interacting)
        //downvote : num (dislikes after user interacting)
        //is_upvote: boolean
        //}
        socket.on('newInteractFromClient', async(data) => {
          const post_updated : Post | null = await this.postService.updateInteraction(data.post_id,{
            upvote: data.upvote,
            downvote: data.downvote
          });
          if (!post_updated){
            throw new NotFoundException("Cannot update post");
          }
          let payload = {
            post_id: data.post_id,
            like: post_updated.upvote, 
            dislike: post_updated.downvote
          };
          this.server.to(data.post_id).emit("updateInteractFromServer", payload);

          //Notification
          if(!isQueueToNotify && data.is_upvote){
            setTimeout(async () => {
              let post_latest_state : Post | null = await this.postService.findPost(data.post_id);
              let payload_notify = {
                is_comment: false,
                post_id: data.post_id,
                content: `Bài viết của bạn đã có ${post_latest_state?.upvote} lượt thích`
              };
              await this.notificationGatewayService.sendNotification(data.user_post_id, payload_notify);
              isQueueToNotify = false;
    
            },30000);	
            isQueueToNotify = true;
          }

        });


        //data = {
          //	user_id: string
          //	cmt_cont: string
          //	level_parent: number (-1 if it is root)
          //	cmt_parent_id: string (could be null)
          //	user_parent_id: string (could be null)
          //	post_id: string
          //	user_post_id: string
        //}

        socket.on('newCommentFromClient', async(data) => {
          let new_cmt : Comment = await this.commentService.createComment(data.user_id, data.cmt_cont, data.post_id, data.cmt_parent_id);	
          // let num_cmts : number  = await this.commentService.getNumberCommentByPost(data.post_id);
          
          // let payload_num_cmts = {
          //   post_id: data.post_id,
          //   num_cmts : num_cmts
          // };

          let payload_detail_cmts = {
            post_id: data.post_id,
            cmt_id: new_cmt.comment_id,
            cmt_parent_id: data.cmt_parent_id || "",
            cmt_content: data.cmt_cont,
            user_id: data.user_id,
            user_name: new_cmt.user.user_name,
            ava_img_path: new_cmt.user.ava_img_path,
            date_cmt: new_cmt.date_comment
          };
          console.log("Room Post: " + data.post_id);
          // console.log(payload_num_cmts);
          console.log(payload_detail_cmts);
          
          // await this.server.to(data.post_id).emit("displayNumberCmts", payload_num_cmts);
          await this.server.to(data.post_id).emit("displayDetailCmts", payload_detail_cmts);
          if(data.level_parent === -1){
            //Bắn noti cho chủ post
            let payload = {
              is_comment: true,
              post_id: data.post_id,
              user_name: new_cmt.user.user_name,
              ava_img_path: new_cmt.user.ava_img_path,
              content: `${new_cmt.user.user_name} đã bình luận vào bài viết: ${data.cmt_cont}.`
            };
            await this.notificationGatewayService.sendNotification(data.user_post_id, payload);
          }
          else{ //cmt là reply
            //Bắn noti cho chủ post

            let payload_hidden = {
              is_comment: true,
              post_id: data.post_id,
              user_name: new_cmt.user.user_name,
              ava_img_path: new_cmt.user.ava_img_path,
              content: `${new_cmt.user.user_name} đã bình luận vào bài viết của bạn.`
            }
            await this.notificationGatewayService.sendNotification(data.user_post_id, payload_hidden);
            
            //Bắn noti cho người được reply
            let payload_show = {
              is_comment: true,
              post_id: data.post_id,
              user_name: new_cmt.user.user_name,
              ava_img_path: new_cmt.user.ava_img_path,
              content: `${new_cmt.user.user_name} đã trả lời một bình luận của bạn: ${data.cmt_cont}.`
            }
            await this.notificationGatewayService.sendNotification(data.user_parent_id, payload_show);
          }
        });
        
        socket.on('leaveRoomPost', async (post_id)=> {
          console.log("User left room Post");  
          socket.leave(post_id); 
        });
    
        
        socket.on('disconnect', () => {  
          console.log('User disconnected');  
        });  
      });        
    }

    
    
    sendNewPostNotificationToAdmin(postData: any) {
      this.server.emit('newPostToAdmin', postData);
    }

    sendNewPostNotification(user_post_id : string, postData: any) {
      this.server.emit(`newPost${user_post_id}`, postData);
    }
  }
  