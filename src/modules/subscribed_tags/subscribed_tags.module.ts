import { Module } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { SubscribedTagsController } from './subscribed_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { TagModule } from '../tag/tag.module';
import { TagByModule } from '../tag_by/tag_by.module';
import { TagByService } from '../tag_by/tag_by.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribedTag]), TagByModule],
  controllers: [SubscribedTagsController],
  providers: [SubscribedTagsService],
  exports: [SubscribedTagsService]
})
export class SubscribedTagsModule {}
