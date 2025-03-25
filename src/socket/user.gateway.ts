import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ReportSubject, UserStatus } from 'global/enum.global';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/modules/auth/auth.service';
import { NotificationService } from 'src/modules/notification/notification.service';
import { PostService } from 'src/modules/post/post.service';
import { UserService } from 'src/modules/user/user.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class UserGateWay implements OnModuleInit {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService,
              private readonly notiService: NotificationService,
              private readonly postService: PostService
  ) {}
  @WebSocketServer() server: Server;

//   onModuleInit() {
//     this.server.on('connection', (socket) => {
//       console.log('A user connected');

//     //   socket.on('joinRoom',  (user_id) => {
//     //     socket.join(user_id);
//     //     console.log("join r"); 
//     //   });
     

//       //Lắng nghe onBan từ admin
//       //data {user_id: string, report_id: string, subject: string}

//       socket.on('onBan', async (data) => {
//         //Thay doi trang thai 
        
//         await this.userService.changeUserStatus(data.user_id,{ status: 'Banned' });
//         //Gui mail
//         let modifySubject = data.subject as ReportSubject
//         await this.authService.sendEmailtoUserBanned(data.user_id,data.report_id, modifySubject)
//         //Emit chi danh cho room dang join vao
//         let payload = {message: "Your account has been banned, you will be logged out in 5s"}
//         this.server.emit(`banAlert_${data.user_id}`, payload);
//       });

//     //   socket.on('leaveRoom', (user_id) => {
//     //     socket.leave(user_id);
//     //   });

//       socket.on('disconnect', () => {
//         console.log('User disconnected');
//       });
//     });
//   }

onModuleInit() {  
	this.server.on('connection', (socket) => {  
		console.log('User connected');
	
		socket.on('joinRoom', async (user_id)=> { 
			console.log("User joined room "); 
                	socket.join(user_id); 
            	});

		socket.on('banUser', async (data) => {
			await this.userService.changeUserStatus(data.user_id, {status: "Banned"});

			let modifySubject = data.subject as ReportSubject;
			await this.authService.sendEmailtoUserBanned(data.user_id, data.reported_id, modifySubject);
            const payload = {message :  "Your account has been banned!"} 
            this.server.to(data.user_id).emit("banAlert",payload);
		});
        
        //restricted
        socket.on('restrictUser', async (data) => {
			this.userService.changeUserStatus(data.user_id, {status: "Restricted"});
            let payload =  {
                is_comment: false,
                content: "Tài khoản của bạn đã bị hạn chế vì vi phạm tiêu chuẩn cộng đồng", 
                post_id: (data.subject === "User") ? "" : data.post_id    
            }
            await this.sendNotification(data.user_id, payload)  
		});

        //review post
        socket.on('reviewPost', async (data) => {
			this.postService.changePostStatus(data.post_id, {status: data.status});
			let payload = {
				is_comment: false,
				content: (data.status === "Approved") ? "Bài post của bạn đã được admin duyệt" 
				: "Bài post của bạn đã bị từ chối vì vi phạm tiêu chuẩn cộng đồng",
				post_id: data.post_id
			};
			this.sendNotification(data.user_id, payload);

		});

		socket.on('leaveRoom', async (user_id)=> {
			console.log("User left room ");  
                	socket.leave(user_id); 
            	});
		socket.on('disconnect', () => {  
        		console.log('User disconnected');  
        	});  

    });
}

async sendNotification(user_id: string, payload: any){
    console.log("vao sendNotification");
    
    let noti = await this.notiService.createNotification(user_id,payload)
    this.server.to(user_id).emit("notify", noti)
}

}
