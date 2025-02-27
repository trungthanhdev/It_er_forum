import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ClassSerializerInterceptor, UseInterceptors, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseData } from 'reponsedata/responsedata';
import { User } from './entities/user.entity';
import { HttpMessage, HttpCode } from 'global/enum.global';
import { RegisterDto } from 'dto/register.dto';
import { AuthService } from '../auth/auth.service';
import { AuthGuard } from 'guard/auth.guard';
import { LoginDto } from 'dto/login.dto';
import { RoleGuard } from 'guard/role.guard';

@Controller('/api/v1/user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService,
              private readonly authService: AuthService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return new ResponseData<User>(
        await this.userService.createUser(createUserDto),
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

  @Get()
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async findAll() {
    console.log(`Fetch successfully!`);
    
    try {
      return new ResponseData<User[]>(
        await this.userService.findAll(),
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

  @Get('/email')
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
  @UseGuards(new RoleGuard(['ADMIN']))
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

  @Post("/refresh-token")
  refreshToken(@Body() {refresh_token}){
    return this.authService.refreshToken(refresh_token)
  }
  
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}


