import { BadRequestException, HttpException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo : Repository<User>
  ){}

  async createUser(createUserDto: CreateUserDto){
    const newUser = await this.userRepo.create(createUserDto)
    return this.userRepo.save(newUser)
  }

  async findAll() {
    return await this.userRepo.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    let user = await this.userRepo.findOne({where: {user_id : id}})
    if(!user){
      throw new BadRequestException("User not found")
    }
    let newUser = this.userRepo.merge(user, updateUserDto)
    this.userRepo.save(newUser)
    return  newUser  
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}


