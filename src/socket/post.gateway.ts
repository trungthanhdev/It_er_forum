import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
import { UserGateWay } from './user.gateway';
import { OnModuleInit } from '@nestjs/common';
import { ReportGateway } from './report.gateway';
  
  @WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })
  export class PostGateway implements OnModuleInit {
    
    @WebSocketServer()
    server: Server;
    private reportGateway: ReportGateway
    onModuleInit(){
      this.reportGateway = new ReportGateway()
    }

    
    
    sendNewPostNotificationToAdmin(postData: any) {
      this.server.emit('newPostToAdmin', postData);
    }

    sendNewPostNotification(user_post_id : string, postData: any) {
      this.server.emit(`newPost${user_post_id}`, postData);
    }
  }
  