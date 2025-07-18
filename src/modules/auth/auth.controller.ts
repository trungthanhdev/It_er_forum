import {
  Body,
  Controller,
  Get,
  OnModuleInit,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'dto/login.dto';
import { RegisterDto } from 'dto/register.dto';
// import { AuthGuard } from 'guard/auth.guard';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { JwtRefreshAuthGuard } from 'guard/refresh.guard';
import { ReportSubject, UserStatus } from 'global/enum.global';
@Controller('api/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    // private readonly userService: UserService,
  ) {}

  // @WebSocketServer() server: Server;
  // onModuleInit() {
  //   this.server.on('connection', (socket) => {
  //     console.log('A user connected');

  //     socket.on('joinRoom', async (user_id) => {
  //       socket.join(user_id);
  //     });
  //     socket.on('leaveRoom', (user_id) => {
  //       socket.leave(user_id);
  //     });
  //     //Lắng nghe onBan từ admin
  //     //data {user_id: string, report_id: string, subject: string}

  //     socket.on('onBan', async (data) => {
  //       //Thay doi trang thai
  //       await this.userService.changeUserStatus(
  //         data.user_id,
  //         UserStatus.BANNED,
  //       );
  //       //Gui mail
  //       let modifySubject = data.subject as ReportSubject;
  //       await this.authService.sendEmailtoUserBanned(
  //         data.user_id,
  //         data.report_id,
  //         modifySubject,
  //       );
  //       //Emit chi danh cho room dang join vao
  //       let payload = {
  //         message: 'Your account has been banned, you will be logged out in 5s',
  //       };
  //       this.server.to(data.user_id).emit('banAlert', payload);
  //     });

  //     socket.on('disconnect', () => {
  //       console.log('User disconnected');
  //     });
  //   });
  // }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async createUser(@Body() registerDto: RegisterDto) {
    return await this.authService.createUser(registerDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('/log-out')
  @UseGuards(JwtAuthGuard)
  logout(@Body() refresh_token: string, @Req() req) {
    // let access_token = req.tokens.access_token
    // console.log(req);
    console.log('token id:', req.user['id']);
    console.log('user_id: ', req.user['user_id']);
    return this.authService.logout(
      refresh_token,
      req.user['id'],
      req.user['user_id'],
    );
  }

  @Get('/refresh-token')
  @UseGuards(JwtRefreshAuthGuard)
  refreshToken(@Req() req) {
    console.log(req.user);
    return this.authService.refreshToken(
      req.user['role'],
      req.user['email'],
      req.user['user_id'],
      req.user['status'],
    );
  }

  @Post('/send-mail-report')
  sendMailReport() {
    return this.authService.sendEmailReport();
  }

  @Post('/send-mail-ban')
  sendEmailtoUserBanned(
    @Query('user_id') user_id: string,
    @Query('report_id') report_id: string,
    @Query('subject') subject: string,
  ) {
    let modifySubject = subject as ReportSubject;
    return this.authService.sendEmailtoUserBanned(
      user_id,
      report_id,
      modifySubject,
    );
  }
}
