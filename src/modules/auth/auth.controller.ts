import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'dto/login.dto';
import { RegisterDto } from 'dto/register.dto';
// import { AuthGuard } from 'guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from '../blacklist/blacklist.service';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { JwtRefreshAuthGuard } from 'guard/refresh.guard';
import { User } from '../user/entities/user.entity';
@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService){}

      @Post("/register")
      @UsePipes(ValidationPipe)
      async createUser(@Body() registerDto: RegisterDto){
        return await this.authService.createUser(registerDto)
      }
    
      @Post("/login")
      @UsePipes(ValidationPipe)
      async login(@Body() loginDto: LoginDto){
        return await this.authService.login(loginDto)
      }
    
      @Post("/log-out")
      @UseGuards(JwtAuthGuard)
      logout(@Body() refresh_token: string,@Req() req){
        // let access_token = req.tokens.access_token    
        // console.log(req);
        console.log("token id:",req.user["id"]);
        console.log("user_id: ",req.user["user_id"]);
        return this.authService.logout(refresh_token, req.user["id"], req.user["user_id"])
      }
    
      @Get("/refresh-token")
      @UseGuards(JwtRefreshAuthGuard)
      refreshToken(@Req() req){
        console.log(req.user);
        return this.authService.refreshToken(req.user["role"],req.user["email"])
      }

      @Get("/send-mail-report")
      sendMailReport(){
        return this.authService.sendEmailReport()
      }
      
}
