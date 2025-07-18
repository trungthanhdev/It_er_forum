import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { BlacklistModule } from '../blacklist/blacklist.module';
import { JwtStrategy } from 'guard/strategy/jwt.guard.strategy';
import { JwtRefreshAuthGuard } from 'guard/refresh.guard';
import { JwtRefreshStrategy } from 'guard/strategy/refresh_token.guard.strategy';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/config/jwt.config';
import refreshConfig from 'src/config/refresh.config';
import { PostModule } from '../post/post.module';
import { SubscribedTagsModule } from '../subscribed_tags/subscribed_tags.module';
import { ReportModule } from '../report/report.module';
import { UserGateWay } from 'src/socket/user.gateway';
import { NotificationModule } from '../notification/notification.module';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(refreshConfig),
    JwtModule.registerAsync(refreshConfig.asProvider()),
    // JwtModule.register({
    // global: true,
    // signOptions: { expiresIn: '1h' },
    // }),
    // forwardRef(() => UserModule),
    UserModule,
    BlacklistModule,
    PostModule,
    SubscribedTagsModule,
    ReportModule,
    NotificationModule,
  ],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, UserGateWay],
  controllers: [AuthController],
  exports: [AuthService, JwtStrategy, JwtRefreshStrategy, UserGateWay],
})
export class AuthModule {}
