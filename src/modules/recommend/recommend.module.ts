import { Module } from '@nestjs/common';
import { RecommendController } from './recommend.controller';
import { RecommendService } from './recommend.service';
import { NotificationModule } from '../notification/notification.module';
import { SubscribedTagsModule } from '../subscribed_tags/subscribed_tags.module';
import { TagModule } from '../tag/tag.module';
import { NotificationService } from '../notification/notification.service';
import { SubscribedTagsService } from '../subscribed_tags/subscribed_tags.service';
import { TagService } from '../tag/tag.service';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { TagByModule } from '../tag_by/tag_by.module';

@Module({
  imports: [
    NotificationModule,
    SubscribedTagsModule,
    TagModule,
    PostModule,
    UserModule,
    TagByModule,
  ],
  controllers: [RecommendController],
  providers: [RecommendService],
  exports: [RecommendService],
})
export class RecommendModule {}
