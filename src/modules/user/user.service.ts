import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'dto/register.dto';
import { isUUID } from 'class-validator';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'global/enum.global';
import { UserDto } from 'dto/resSearchUserByUserName.dto';
import { ResUserDto } from 'dto/resUser.dto';
import { ResCurrentUserDto } from 'dto/resCurrentUser.dto';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo : Repository<User>
  ){}

  async createNewAdmin(registerDto : RegisterDto){
    const findEmail = await this.findByEmail(registerDto.email)
    if(findEmail) {
      throw new BadRequestException("Email is existed!")
    }
    let admin = await this.userRepo.create(registerDto)
    let newAdmin = await this.userRepo.save(admin) 
    return newAdmin
  }
  
  async findAllUser() {
    let user =  await this.userRepo.find()
    let resUser = user.map((user) => {
      let resUser = new ResUserDto()
      resUser.user_id = user.user_id,
      resUser.user_name = user.user_name,
      resUser.age = user.age,
      resUser.ava_img_path = user.ava_img_path,
      resUser.phone_num = user.phone_num,
      resUser.email = user.email,
      resUser.first_name = user.first_name,
      resUser.last_name = user.last_name,
      resUser.status = user.status
      return resUser
    })
    return resUser
  }

  //used for handling event in another api
  async findByEmail(email: string ){
    return await this.userRepo.findOneBy({email})
  }

  async searchUserByUserName(user_name: string){
      let users =  await this.userRepo.find({where: {
        user_name : ILike(user_name.trim().replace(/\s+/g, ' '))
      }})
      if(users.length === 0 ){ throw new NotFoundException(`User name "${user_name} invalid"`)}

     try {
      let response = users.map((user) =>{
        let userElement = new UserDto()
          userElement.user_id = user.user_id
          userElement.user_name = user.user_name
          userElement.ava_img_path = user.ava_img_path
          userElement.status = user.status
          return userElement
      })
      return response
     } catch (error) {
        throw error
     }
  }

  async updateProfile(id: string, updateUserDto: Partial<UpdateUserDto>, reqCurrentUser: User) {
    let user = await this.userRepo.findOne({where: {user_id : id}})
    if(!user){
      throw new BadRequestException("User not found")
    }
    if(reqCurrentUser.user_id !== id){
      throw new UnauthorizedException("Can't change another profile!")
    }

    let newUser = this.userRepo.merge(user, updateUserDto)
    this.userRepo.save(newUser)
    let resUser = new ResCurrentUserDto()
    resUser.user_id = newUser.user_id
    resUser.user_name = newUser.user_name
    resUser.last_name = newUser.last_name
    resUser.first_name = newUser.first_name
    resUser.age = newUser.age
    resUser.ava_img_path = newUser.ava_img_path
    resUser.email = newUser.email
    resUser.phone_num = newUser.phone_num
    return  resUser
  }

  // api return user information but password
  async getUserById(id: string) {
    if (!isUUID(id)) {
        throw new NotFoundException(`ID "${id}" invalid`);
    }

    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
        throw new NotFoundException(`Id "${id}" not found !`);
    }
    
    let resUser = new ResUserDto()
    resUser.user_id = user.user_id,
    resUser.user_name = user.user_name,
    resUser.age = user.age,
    resUser.ava_img_path = user.ava_img_path,
    resUser.phone_num = user.phone_num,
    resUser.email = user.email,
    resUser.first_name = user.first_name,
    resUser.last_name = user.last_name,
    resUser.status = user.status
    return resUser
  }

  // output include password (User) for handling event in another api
  async findUserById(id: string) {

    if (!isUUID(id)) {
        throw new NotFoundException(`ID "${id}" invalid`);
    }

    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
        throw new NotFoundException(`Id "${id}" not found !`);
    }

    return user
  }

  async updatePassword(id: string, updatPasswordDto : UpdatePasswordDto){
   try {
    let user = await this.findUserById(id)
    if(!user) {
      throw new NotFoundException()
    }
    
    const isMatch = await bcrypt.compare(updatPasswordDto.oldPassword, user.password);
    
    if(!isMatch){
      throw new BadRequestException("Old password is incorrect!")
    }
   
    const hashNewPassword = await bcrypt.hash(updatPasswordDto.newPassword, 10);
    
    const isMatchNewPassword = await bcrypt.compare(updatPasswordDto.newPassword,user.password);
    
    if(isMatchNewPassword){
      throw new BadRequestException("New password and old password are same!")
    }

    user.password = hashNewPassword

    await this.userRepo.save(user)
  
    return ({
      message: "Change password successfully!"
    })
   } catch (error) {
      throw error
   }

  }

  async changeUserStatus(id: string ,status : string){
    let userStatus = (status as any).status 
    if(!Object.values(UserStatus).includes(userStatus)){
      throw new BadRequestException("Invalid user status!")
    }

    let user = await this.findUserById(id)
    if(!user){
      throw new NotFoundException("User not found!")
    }
    
    user.status = userStatus
 
    await this.userRepo.save(user)
    let resUser = new ResUserDto()
    resUser.user_id = user.user_id,
    resUser.user_name = user.user_name,
    resUser.age = user.age,
    resUser.ava_img_path = user.ava_img_path,
    resUser.phone_num = user.phone_num,
    resUser.email = user.email,
    resUser.first_name = user.first_name,
    resUser.last_name = user.last_name,
    resUser.status = user.status
    return resUser
  }

  getProfile(user : User){
    let resUser = new ResCurrentUserDto()
    resUser.user_id = user.user_id
    resUser.user_name = user.user_name
    resUser.last_name = user.last_name
    resUser.first_name = user.first_name
    resUser.age = user.age
    resUser.ava_img_path = user.ava_img_path
    resUser.email = user.email
    resUser.phone_num = user.phone_num

    return resUser
  }
}

