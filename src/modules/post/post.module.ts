import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { BlacklistModule } from '../blacklist/blacklist.module';
import { TagByModule } from '../tag_by/tag_by.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule, BlacklistModule, TagByModule, TagModule],
  controllers: [PostController],
  providers: [PostService],
  exports: [PostService]
})
export class PostModule {}
