import { Controller, Get, Post, Body, Patch, Param, Query, ClassSerializerInterceptor, UseInterceptors, UseGuards, UsePipes, ValidationPipe, Res, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';

@Controller('/api/v1/users')
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

 

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Get("/:user_name")
  @UseGuards(AuthGuard)
  searchUserByUserName(
    @Param("user_name") user_name : string){
      return this.userService.searchUserByUserName(user_name)
  }

  @Get("/user-detail/:id")
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
  async changeUserStatus(@Param("id") id: string, @Body() status : string){
    // console.log(updateUserStatusdto);
    return await this.userService.changeUserStatus(id,status)
  }

}


