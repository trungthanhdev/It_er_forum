import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from '../../../dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, ILike, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from 'dto/register.dto';
import { isUUID } from 'class-validator';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import * as bcrypt from 'bcrypt';
import { Roles, UserStatus } from 'global/enum.global';
import { UserDto } from 'dto/resSearchUserByUserName.dto';
import { ResUserDto } from 'dto/resUser.dto';
import { ResCurrentUserDto } from 'dto/resCurrentUser.dto';
import { PostService } from '../post/post.service';
// import { UserGateWay } from 'src/socket/user.gateway';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    // private readonly userGateway: UserGateWay
  ) {}

  async createNewAdmin(registerDto: RegisterDto) {
    console.log('vao service');

    const findEmail = await this.findByEmail(registerDto.email);
    if (findEmail) {
      throw new BadRequestException('Email is existed!');
    }
    let admin = await this.userRepo.create(registerDto);
    let newAdmin = await this.userRepo.save(admin);
    return newAdmin;
  }

  async findAllUser() {
    let user = await this.userRepo.find();
    let resUser = user.map((user) => {
      let resUser = new ResUserDto();
      (resUser.user_id = user.user_id),
        (resUser.user_name = user.user_name),
        (resUser.age = user.age),
        (resUser.ava_img_path = user.ava_img_path),
        (resUser.phone_num = user.phone_num),
        (resUser.email = user.email),
        (resUser.first_name = user.first_name),
        (resUser.last_name = user.last_name),
        (resUser.status = user.status);
      return resUser;
    });
    return resUser;
  }

  //used for handling event in another api
  async findByEmail(email: string) {
    return await this.userRepo.findOneBy({ email });
  }

  async searchUserByUserName(user_name: string) {
    let users = await this.userRepo.find({
      where: {
        user_name: ILike(user_name.trim().replace(/\s+/g, ' ')),
      },
    });
    if (users.length === 0) {
      throw new NotFoundException(`User name "${user_name} invalid"`);
    }

    try {
      let response = users.map((user) => {
        let userElement = new UserDto();
        userElement.user_id = user.user_id;
        userElement.user_name = user.user_name;
        userElement.ava_img_path = user.ava_img_path;
        userElement.status = user.status;
        return userElement;
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

 async updateProfile(
    id: string,
    updateUserDto: Partial<UpdateUserDto>,
    reqCurrentUser_id: string,
    ava_img_path?: string,
  ): Promise<ResCurrentUserDto> {
    let user = await this.userRepo.findOne({ where: { user_id: id } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }
    if (reqCurrentUser_id !== id) {
      throw new UnauthorizedException('Không thể chỉnh sửa hồ sơ của người khác!');
    }

    //? Tạo object chứa dữ liệu cập nhật
    const updatedData: Partial<User> = { ...updateUserDto };
    if (ava_img_path) {
      updatedData.ava_img_path = ava_img_path;
    }
    // console.log('Updated data:', updatedData); 

    //? Áp dụng dữ liệu cập nhật vào entity
    Object.assign(user, updatedData);
    // console.log('User before save:', user); 

    //? Lưu vào database
    const savedUser = await this.userRepo.save(user);
    // console.log('Saved user:', savedUser);


    let resUser = new ResCurrentUserDto();
    resUser.user_id = savedUser.user_id;
    resUser.user_name = savedUser.user_name;
    resUser.last_name = savedUser.last_name;
    resUser.first_name = savedUser.first_name;
    resUser.age = savedUser.age;
    resUser.ava_img_path = savedUser.ava_img_path;
    resUser.email = savedUser.email;
    resUser.phone_num = savedUser.phone_num;
    // console.log('Response user:', resUser); 
    return resUser;
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

    let resUser = new ResUserDto();
    (resUser.user_id = user.user_id),
      (resUser.user_name = user.user_name),
      (resUser.age = user.age),
      (resUser.ava_img_path = user.ava_img_path),
      (resUser.phone_num = user.phone_num),
      (resUser.email = user.email),
      (resUser.first_name = user.first_name),
      (resUser.last_name = user.last_name),
      (resUser.status = user.status);
    return resUser;
  }

  // output include password (User) for handling event in another api
  async findUserById(id: string) {
    if (!isUUID(id)) {
      throw new NotFoundException(`ID "${id}" invalid`);
    }

    const user = await this.userRepo.findOne({
      where: { user_id: id },
      relations: ['subscribed_tags', 'subscribed_tags.tag'],
    });

    if (!user) {
      throw new NotFoundException(`Id "${id}" not found !`);
    }

    return user;
  }

  async findAdmin() {
    let admin = Roles.ADMIN;
    return await this.userRepo.find({ where: { role: admin } });
  }
  async updatePassword(id: string, updatPasswordDto: UpdatePasswordDto) {
    try {
      let user = await this.findUserById(id);
      if (!user) {
        throw new NotFoundException();
      }

      const isMatch = await bcrypt.compare(
        updatPasswordDto.oldPassword,
        user.password,
      );

      if (!isMatch) {
        throw new BadRequestException('Old password is incorrect!');
      }

      const hashNewPassword = await bcrypt.hash(
        updatPasswordDto.newPassword,
        10,
      );

      const isMatchNewPassword = await bcrypt.compare(
        updatPasswordDto.newPassword,
        user.password,
      );

      if (isMatchNewPassword) {
        throw new BadRequestException(
          'New password and old password are same!',
        );
      }

      user.password = hashNewPassword;

      await this.userRepo.save(user);

      return {
        message: 'Change password successfully!',
      };
    } catch (error) {
      throw error;
    }
  }

  async changeUserStatus(id: string, status: any) {
    console.log(id, status);

    let userStatus = (status as any).status;
    console.log(userStatus);

    if (!Object.values(UserStatus).includes(userStatus)) {
      throw new BadRequestException('Invalid user status!');
    }

    let user = await this.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found!');
    }

    user.status = userStatus;

    await this.userRepo.save(user);
    let resUser = new ResUserDto();
    (resUser.user_id = user.user_id),
      (resUser.user_name = user.user_name),
      (resUser.age = user.age),
      (resUser.ava_img_path = user.ava_img_path),
      (resUser.phone_num = user.phone_num),
      (resUser.email = user.email),
      (resUser.first_name = user.first_name),
      (resUser.last_name = user.last_name),
      (resUser.status = user.status);

    if (resUser.status === UserStatus.BANNED) {
      // this.userGateway.sendBannedUserNotification(id, resUser)
    }

    return resUser;
  }

  async getProfile(user: User) {
    let currentUser = await this.findUserById(user.user_id);
    let resUser = new ResCurrentUserDto();
    resUser.user_id = currentUser.user_id;
    resUser.user_name = currentUser.user_name;
    resUser.last_name = currentUser.last_name;
    resUser.first_name = currentUser.first_name;
    resUser.age = currentUser.age;
    resUser.ava_img_path = currentUser.ava_img_path;
    resUser.email = currentUser.email;
    resUser.phone_num = currentUser.phone_num;
    return resUser;
  }

  async countNewUsersPerDay() {
    const today = new Date();
    let yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const totalNewUser = await this.userRepo.count({
      where: {
        time_stamp: Between(yesterday, today),
      },
    });
    // console.log(totalNewUser);

    return totalNewUser;
  }
}
