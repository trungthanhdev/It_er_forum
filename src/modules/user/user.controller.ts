import { Controller, Get, Post, Body, Patch, Param, Query, ClassSerializerInterceptor, UseInterceptors, UseGuards, UsePipes, ValidationPipe, Res, Req, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseData } from 'reponsedata/responsedata';
import { User } from './entities/user.entity';
import { HttpMessage, HttpCode } from 'global/enum.global';
import { RegisterDto } from 'dto/register.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'guard/auth.guard';
import { LoginDto } from 'dto/login.dto';
import { RoleGuard } from 'guard/role.guard';
import {Response, Request} from 'express'

@Controller('/api/v1/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService
  ) {}


  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async findAllUser() {
    console.log(`Fetch successfully!`);
    
    try {
      return new ResponseData<User[]>(
        await this.userService.findAllUser(),
        HttpCode.SUCCESS,
        HttpMessage.SUCCESS
      )
    } catch (error) {
      return new ResponseData<User>(
        [],
        HttpCode.ERROR,
        HttpMessage.ERROR
      )
    }
  }
  // @Get("/current-user")
  // @UseGuards(AuthGuard)
  // getCurrentUser(@Req() req : Request){
  //   return req.currentUser
  // }

  @Get('/email')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard) 
   async findByEmail(@Query("email") email: string) {
      try {
        const userEmail = await this.userService.findByEmail(email)
        if(!userEmail){
          return new ResponseData<User>(
            [],
            HttpCode.ERROR,
            HttpMessage.INVALID_EMAIL 
          )
        }
        return new ResponseData<User>(
          userEmail,
          HttpCode.SUCCESS,
          HttpMessage.SUCCESS
        )
      } catch (error) {
        return new ResponseData<User>(
          [],
          HttpCode.ERROR,
          HttpMessage.INVALID_EMAIL
        )
      }
  }

  @Post("/register")
  @UseGuards(new RoleGuard(['ADMIN'])) //admin dang nhap vao moi tao tk cho admin khac dc
  @UseGuards(AuthGuard)
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
   logout(@Res() res: Response, @Req() req: Request){
    const refreshToken = req.cookies['refresh_token']

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }
    
    res.clearCookie('refresh_token',{
      httpOnly: true,
      secure: true,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Get("/:user_name")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  searchUserByUserName(
    @Param("user_name") user_name : string){
      return this.userService.searchUserByUserName(user_name)
  }

  @Get("/user-detail/:id")
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async findUserById(@Param('id') id : string){
    return await this.userService.findUserById(id)
  }
  
}


