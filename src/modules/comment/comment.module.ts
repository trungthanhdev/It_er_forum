import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { NotificationModule } from '../notification/notification.module';
import { PostGateway } from 'src/socket/post.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    UserModule,
    PostModule,
    NotificationModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, PostGateway],
  exports: [CommentService, PostGateway],
})
export class CommentModule {}
