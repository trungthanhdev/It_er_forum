import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { UserModule } from '../user/user.module';
import { NotificationGatewayService } from 'src/socket/notfication.gateway.service';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationEntity]), UserModule],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationGatewayService],
  exports: [NotificationService, NotificationGatewayService],
})
export class NotificationModule {}
