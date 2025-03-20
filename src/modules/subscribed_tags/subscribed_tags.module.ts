import { Module } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { SubscribedTagsController } from './subscribed_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribedTag])],
  controllers: [SubscribedTagsController],
  providers: [SubscribedTagsService],
})
export class SubscribedTagsModule {}
