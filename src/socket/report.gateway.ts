import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
      origin: '*', 
    },
  })

  export class ReportGateway{
    @WebSocketServer()
    server: Server

    sendNewReprt(reportData: any){
        this.server.emit("newReportToAdmin", reportData)
    }
  }