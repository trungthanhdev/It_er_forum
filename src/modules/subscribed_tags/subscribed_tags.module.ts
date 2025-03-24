import { Module } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { SubscribedTagsController } from './subscribed_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribedTag]),
            TagModule
  ],
  controllers: [SubscribedTagsController],
  providers: [SubscribedTagsService],
  exports: [SubscribedTagsService]
})
export class SubscribedTagsModule {}
