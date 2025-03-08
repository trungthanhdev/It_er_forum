import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'dto/register.dto';
import { isUUID } from 'class-validator';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserStatusDto } from 'dto/userstatus.dto';
import { UserStatus } from 'global/enum.global';
import { UserDto } from 'dto/resSearchUserByUserName.dto';
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
    return await this.userRepo.find();
  }

  async findByEmail(email: string ){
    return await this.userRepo.findOneBy({email})
  }

  async searchUserByUserName(user_name: string){
      let users =  await this.userRepo.find({where: {
        user_name : user_name.trim().replace(/\s+/g, ' ')
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

  async updateProfile(id: string, updateUserDto: Partial<UpdateUserDto>) {
    let user = await this.userRepo.findOne({where: {user_id : id}})
    if(!user){
      throw new BadRequestException("User not found")
    }
    let newUser = this.userRepo.merge(user, updateUserDto)
    this.userRepo.save(newUser)
    return  newUser  
  }

  async getUserById(id: string) {

    if (!isUUID(id)) {
        throw new NotFoundException(`ID "${id}" invalid`);
    }

    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
        throw new NotFoundException(`Id "${id}" not found !`);
    }

    return {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_name: user.user_name,
      email: user.email,
      phone_num: user.phone_num,
      age: user.dob, 
      status: user.status,
      ava_img_path: user.ava_img_path 
    };
  }

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

  async changeUserStatustoRestricted(id: string, status: UpdateUserStatusDto){
      if (!isUUID(id)) {
        throw new BadRequestException("Invalid UUID format or wrong UUID");
      }
      
      let user = await this.userRepo.findOne({where : {user_id: id}})
      if(!user){
        throw new BadRequestException("User not found")
      }
      
      user.status = UserStatus.RESTRICTED
      await this.userRepo.save(user)
      return {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        user_name: user.user_name,
        email: user.email,
        phone_num: user.phone_num,
        age: user.dob,
        status: user.status,
        ava_img_path: user.ava_img_path
      }
  }

  async changeUserStatustoBanned(id: string, status: UpdateUserStatusDto){
    if (!isUUID(id)) {
      throw new BadRequestException("Invalid UUID format or wrong UUID");
    }

    let user = await this.userRepo.findOne({where : {user_id: id}})

    if(!user){
      throw new BadRequestException("User not found")
    }

    user.status = UserStatus.BANNED
    await this.userRepo.save(user)
    return {
      user_id: user.user_id,
      first_name: user.first_name,
      last_name: user.last_name,
      user_name: user.user_name,
      email: user.email,
      phone_num: user.phone_num,
      age: user.dob,
      status: user.status,
      ava_img_path: user.ava_img_path
    }
  }

  // async changeUserStatus(id: string, status: UpdateUserStatusDto){
  //   switch (status.status) {
  //     case UserStatus.ACTIVE:
  //       let user = await this.userRepo.findOne({where : {user_id: id}})

  //       if(!user){
  //         throw new NotFoundException("User not found")
  //       }

  //       user.status = UserStatus.RESTRICTED
  //       return await this.userRepo.save(user)
    
  //     case UserStatus.RESTRICTED:
  //         let restrictedUser = await this.userRepo.findOne({where : {user_id: id}})

  //       if(!restrictedUser){
  //         throw new NotFoundException("User not found")
  //       }

  //       restrictedUser.status = UserStatus.BANNED
  //       return await this.userRepo.save(restrictedUser)
  //     default:
  //       throw new BadRequestException("Invalid status")
  //   }
  // }
}

