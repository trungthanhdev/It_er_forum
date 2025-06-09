import { forwardRef, Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { BlacklistModule } from '../blacklist/blacklist.module';
import { TagByModule } from '../tag_by/tag_by.module';
import { TagModule } from '../tag/tag.module';
import { PostGateway } from 'src/socket/post.gateway';
// import { FileStorageModule } from '../file_storage/file_storage.module';
// import { FirebaseService } from '../firebase/firebase.service';
// import { FirebaseModule } from '../firebase/firebase.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]),
  UserModule,
  BlacklistModule, 
  TagByModule,
  TagModule, 
  // FileStorageModule,
  // FirebaseModule,
  NotificationModule],
  controllers: [PostController],
  providers: [
    PostService, 
    // PostGateway
  ],
  exports: [PostService]
})
export class PostModule {}
