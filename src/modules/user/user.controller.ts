import { Controller, Get, Post, Body, Patch, Param, Query, ClassSerializerInterceptor, UseInterceptors, UseGuards, UsePipes, ValidationPipe, Res, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { ResponseData } from 'reponsedata/responsedata';
import { User } from './entities/user.entity';
import { HttpMessage, HttpCode, UserStatus } from 'global/enum.global';
import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import { UpdateUserStatusDto } from 'dto/userstatus.dto';

@Controller('/api/v1/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}
  
  @Get()
  // @UseGuards(new RoleGuard(['ADMIN']))
  // @UseGuards(AuthGuard)
  async findAllUser() {
    console.log(`Fetch successfully!`);
    return this.userService.findAllUser()
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
    return await this.userService.getUserById(id)
  }
  
  @Post("/:id/update-password")
  @UseGuards(AuthGuard)
  updatePassword(
    @Param("id") id : string,
    @Body() updatPasswordDto: UpdatePasswordDto){
    return this.userService.updatePassword(id,updatPasswordDto)
  }

  @Patch("/admin/:id")
  @UsePipes(new ValidationPipe)
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async changeUserStatus(@Param("id") id: string, @Body() updateUserStatusdto : UpdateUserStatusDto){
    console.log(updateUserStatusdto.status);
    
      switch (updateUserStatusdto.status) {
        case UserStatus.ACTIVE:
          return await this.userService.changeUserStatustoRestricted(id, updateUserStatusdto)
        case UserStatus.RESTRICTED:
          return await this.userService.changeUserStatustoBanned(id, updateUserStatusdto)
        case UserStatus.BANNED:
          return { message: "User is already banned" }
        default:
          throw new BadRequestException("Invalid status")
      }
      // return await this.userService.changeUserStatus(id, updateUserStatusdto)
  }

}


