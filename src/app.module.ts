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


@Module({
  imports: [UserModule, PostModule, AuthModule,
    
    TypeOrmModule.forRoot(pgConfig), BlacklistModule, ReportModule, CommentModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}
