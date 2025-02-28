import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'dto/register.dto';

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

   async searchUser(email: string , user_name: string){
    return await this.userRepo.findOne({where: {
      email : email,
      user_name : user_name
    }})
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
}


