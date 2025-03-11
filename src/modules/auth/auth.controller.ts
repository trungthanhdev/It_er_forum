import { Body, Controller, Get, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'dto/login.dto';
import { RegisterDto } from 'dto/register.dto';
import { AuthGuard } from 'guard/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from '../blacklist/blacklist.service';
@Controller('api/v1/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly jwtService: JwtService,
        private readonly blacklistService: BlacklistService){}

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
      @UseGuards(AuthGuard)
      logout(@Body() refresh_token: string,@Req() req ){
        // console.log(req);
        let access_token = req.tokens.access_token    
        return this.authService.logout(refresh_token, access_token)
      }
    
      @Post("/refresh-token")
      refreshToken(@Body() {refresh_token}){
        return this.authService.refreshToken(refresh_token)
      }

      
}
