import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { BlacklistModule } from '../blacklist/blacklist.module';
// import { UserGateWay } from 'src/socket/user.gateway';


@Module({
  imports: [TypeOrmModule.forFeature([User]),
  // forwardRef(() => PostModule),
  BlacklistModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
