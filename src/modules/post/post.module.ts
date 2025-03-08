import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { UserModule } from '../user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { NSFWFilteredInterceptor } from 'interceptor/filterNSFW.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), UserModule],
  controllers: [PostController],
  providers: [PostService,
    {
      provide: APP_INTERCEPTOR,
      useClass: NSFWFilteredInterceptor,
    },
  ],
  exports: [PostService]
})
export class PostModule {}
