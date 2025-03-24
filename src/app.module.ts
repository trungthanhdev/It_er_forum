import { Module } from '@nestjs/common';
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
import { HttpExceptionFilter } from 'filter/httpException.interceptor';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { SubscribedTagsModule } from './modules/subscribed_tags/subscribed_tags.module';
import { JwtService } from '@nestjs/jwt';
import { FirebaseModule } from './modules/firebase/firebase.module';
import { FileStorageModule } from './modules/file_storage/file_storage.module';
import { RecommendModule } from './modules/recommend/recommend.module';



@Module({
  imports: [UserModule, PostModule, AuthModule,
    TypeOrmModule.forRoot(pgConfig), BlacklistModule, ReportModule, CommentModule, NotificationModule, TagModule, TagByModule,
    //node-mailer config
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        ignoreTLS: true,
        secure: true,
        auth: {
          user: process.env.MAIL_COMPANY,
          pass: process.env.PASS_COMPANY,
        },
      },
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: process.cwd()+ '/src/mail', 
        // dir: join(__dirname, 'mail'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    ScheduleModule.forRoot(),
    SubscribedTagsModule,
    RecommendModule,
    FirebaseModule,
    FileStorageModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService,JwtService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule  {
  
}
