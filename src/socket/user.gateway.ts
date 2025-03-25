import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReportSubject, UserStatus } from 'global/enum.global';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateWay implements OnModuleInit {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService
  ) {}
  @WebSocketServer() server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('A user connected');

    //   socket.on('joinRoom',  (user_id) => {
    //     socket.join(user_id);
    //     console.log("join r"); 
    //   });
     

      //Lắng nghe onBan từ admin
      //data {user_id: string, report_id: string, subject: string}

      socket.on('onBan', async (data) => {
        //Thay doi trang thai 
        
        await this.userService.changeUserStatus(data.user_id,{ status: 'Banned' });
        //Gui mail
        let modifySubject = data.subject as ReportSubject
        await this.authService.sendEmailtoUserBanned(data.user_id,data.report_id, modifySubject)
        //Emit chi danh cho room dang join vao
        let payload = {message: "Your account has been banned, you will be logged out in 5s"}
        this.server.emit(`banAlert_${data.user_id}`, payload);
      });

    //   socket.on('leaveRoom', (user_id) => {
    //     socket.leave(user_id);
    //   });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  }
}
