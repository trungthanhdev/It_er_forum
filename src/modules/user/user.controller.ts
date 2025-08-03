import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  ClassSerializerInterceptor,
  UseInterceptors,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Res,
  Req,
  UnauthorizedException,
  BadRequestException,
  Put,
  Inject,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../../../dto/update-user.dto';
// import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import { UpdatePasswordDto } from 'dto/updatePassword.dto';
import { JwtAuthGuard } from 'guard/jwt.guard';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs'; 
import { CloudinaryService } from '../Cloudinary/cloudinary.service';
import { diskStorage, MulterError } from 'multer';
import { extname } from 'path';
@Controller('/api/v1/users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cloudinaryService: CloudinaryService
  ) {}
  
  @Get()
  // @UseGuards(new RoleGuard(['ADMIN']))
  // @UseGuards(AuthGuard)
  async findAllUser() {
    console.log(`Fetch successfully!`);
    return this.userService.findAllUser();
  }

  @Get('/profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    let user = req.user;
    console.log(req.user);

    return this.userService.getProfile(user);
  }

  @Patch('/profile/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor({
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        console.log('File received:', file);
        if (!file) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Không nhận được file'), false);
        }
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'Chỉ hỗ trợ file ảnh (jpg, jpeg, png, gif)'), false);
        }
        if (!['avatar', 'background_img'].includes(file.fieldname)) {
          return cb(new MulterError('LIMIT_UNEXPECTED_FILE', `Chỉ hỗ trợ field avatar hoặc background_img, nhận được ${file.fieldname}`), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
  ) {
    console.log('Files in updateProfile:', files);
    const currentUser_id = req.user['user_id'];
    if (currentUser_id !== id) {
      throw new BadRequestException('Không thể chỉnh sửa hồ sơ của người khác!');
    }

    let ava_img_path: string | undefined;
    let background_img_path: string | undefined;

    for (const file of files) {
      try {
        if (file.fieldname === 'avatar') {
          console.log('Uploading avatar to Cloudinary:', file.path);
          const uploadResult = await this.cloudinaryService.uploadImage(
            file.path,
            'user_avatars',
            `${id}_avatar`,
          );
          console.log('Cloudinary upload result (avatar):', uploadResult);
          ava_img_path = uploadResult.secure_url;
          fs.unlinkSync(file.path); // Xóa file tạm
        } else if (file.fieldname === 'background_img') {
          console.log('Uploading background_img to Cloudinary:', file.path);
          const uploadResult = await this.cloudinaryService.uploadImage(
            file.path,
            'user_backgrounds',
            `${id}_background`,
          );
          console.log('Cloudinary upload result (background_img):', uploadResult);
          background_img_path = uploadResult.secure_url;
          fs.unlinkSync(file.path); // Xóa file tạm
        }
      } catch (error) {
        console.error(`Cloudinary upload error (${file.fieldname}):`, error);
        throw new BadRequestException(`Lỗi khi upload ảnh ${file.fieldname} lên Cloudinary: ${error.message}`);
      }
    }

    console.log('Updating profile with:', { ava_img_path, background_img_path });
    return this.userService.updateProfile(id, updateUserDto, currentUser_id, ava_img_path, background_img_path);
  }

  @Get('/:user_name')
  @UseGuards(JwtAuthGuard)
  searchUserByUserName(@Param('user_name') user_name: string) {
    return this.userService.searchUserByUserName(user_name);
  }

  @Get('/user-detail/:id')
  @UseGuards(JwtAuthGuard)
  async findUserById(@Param('id') id: string) {
    return await this.userService.getUserById(id);
  }

  @Post('/:id/update-password')
  @UseGuards(JwtAuthGuard)
  updatePassword(
    @Param('id') id: string,
    @Body() updatPasswordDto: UpdatePasswordDto,
  ) {
    return this.userService.updatePassword(id, updatPasswordDto);
  }

  @Patch('/admin/:id')
  @UsePipes(new ValidationPipe())
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
  async changeUserStatus(@Param('id') id: string, @Body() status: string) {
    return await this.userService.changeUserStatus(id, status);
  }
}
