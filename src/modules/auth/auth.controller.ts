import { Body, Controller, Post, Req, Res, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'dto/login.dto';
import { RegisterDto } from 'dto/register.dto';
import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import {Response, Request} from 'express'
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
      async register(@Body() registerDto: RegisterDto){
        return await this.authService.register(registerDto)
      }
    
      @Post("/login")
      @UsePipes(ValidationPipe)
      async login(@Body() loginDto: LoginDto){
        return await this.authService.login(loginDto)
      }
    
      @Post("/log-out")
      @UseGuards(AuthGuard)
      async logout(@Res() res: Response, @Req() req: Request){
        const refreshToken = req.cookies['refresh_token']
    
        if (!refreshToken) {
          throw new UnauthorizedException('No refresh token found');
        }
        console.log("rf from UserController ",refreshToken);
        
        try {
          let payload = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_TOKEN})
          let rf_id = payload.id
          await this.blacklistService.addToBlacklist(rf_id)
    
        } catch (error) {
          throw error
        }
        
        
        res.clearCookie('refresh_token',{
          httpOnly: true,
          // secure: true,
          sameSite: 'strict'
        })
        return ({msg: "Log out successfully"})
      }
    
      @Post("/refresh-token")
      @UseGuards(new RoleGuard(['ADMIN']))
      @UseGuards(AuthGuard)
      refreshToken(@Body() {refresh_token}){
        return this.authService.refreshToken(refresh_token)
      }
}
