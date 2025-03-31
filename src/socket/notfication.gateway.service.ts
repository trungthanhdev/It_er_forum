import { Injectable } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { NotificationService } from "src/modules/notification/notification.service";

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGatewayService {
  constructor(private readonly notiService: NotificationService) {}
  @WebSocketServer() server: Server;

    async sendNotification(user_id: string, payload: any){
        console.log("vao sendNotification");
        
        let noti = await this.notiService.createNotification(user_id,payload)
        await this.server.to(user_id).emit("notify", noti)
    }
}