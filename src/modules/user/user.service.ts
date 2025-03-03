import { BadRequestException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'dto/register.dto';
import { isUUID } from 'class-validator';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import * as bcrypt from 'bcrypt';
import { log } from 'console';
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
      return users
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

  async findUserById(id: string) {

    if (!isUUID(id)) {
        throw new NotFoundException(`ID "${id}" invalid`);
    }

    const user = await this.userRepo.findOne({ where: { user_id: id } });

    if (!user) {
        throw new NotFoundException(`Id "${id}" not found !`);
    }

    return user;
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
}

