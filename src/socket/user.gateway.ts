import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
      origin: '*', 
    },
})

export class UserGateWay{
    @WebSocketServer()
    server: Server

    sendBannedUserNotification(user_id: string, payload: any){
        this.server.emit(`bannedUser${user_id}`, payload)
    }
}