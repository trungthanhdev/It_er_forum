import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthModule } from '../auth/auth.module';
import { BlacklistModule } from '../blacklist/blacklist.module';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  forwardRef(() => AuthModule),
  BlacklistModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
