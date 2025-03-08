import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { PostModule } from './modules/post/post.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { pgConfig } from 'dbconfig';
import { BlacklistModule } from './modules/blacklist/blacklist.module';
import { ReportModule } from './modules/report/report.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TagModule } from './modules/tag/tag.module';
import { TagByModule } from './modules/tag_by/tag_by.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from 'interceptor/httpException.interceptor';


@Module({
  imports: [UserModule, PostModule, AuthModule,
    TypeOrmModule.forRoot(pgConfig), BlacklistModule, ReportModule, CommentModule, NotificationModule, TagModule, TagByModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule  {
  
}
