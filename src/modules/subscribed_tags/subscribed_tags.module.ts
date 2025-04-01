import { Module } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';
import { SubscribedTagsController } from './subscribed_tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscribedTag } from './entities/subscribed_tag.entity';
import { TagModule } from '../tag/tag.module';
import { TagByModule } from '../tag_by/tag_by.module';
import { StatisticsGateway } from 'src/socket/statistics.gateway';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubscribedTag]),
            TagModule,TagByModule, UserModule
  ],
  controllers: [SubscribedTagsController],
  providers: [SubscribedTagsService, StatisticsGateway],
  exports: [SubscribedTagsService, StatisticsGateway]
})
export class SubscribedTagsModule {}
