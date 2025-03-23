import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
  } from '@nestjs/websockets';
  import { Server } from 'socket.io';
  
  @WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })
  export class PostGateway {
    @WebSocketServer()
    server: Server;

    sendNewPostNotificationToAdmin(postData: any) {
      this.server.emit('newPostToAdmin', postData);
    }

    sendNewPostNotification(user_post_id : string,postData: any) {
      this.server.emit(`newPost${user_post_id}`, postData);
    }
  }
  