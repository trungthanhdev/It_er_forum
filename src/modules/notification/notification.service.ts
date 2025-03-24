import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationEntity } from './entities/notification.entity';
import { isUUID } from 'class-validator';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { ResNotification } from 'dto/resNotification.dto';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(NotificationEntity)
        private readonly notifiRepo : Repository<NotificationEntity>,
    )
    {}


    async getNotificationByUserId(user_id:string) : Promise<ResNotification[]>{
        if (!isUUID(user_id)) {
            throw new BadRequestException("Invalid post_id format!");
        }
        const notifications: NotificationEntity[] =  await this.notifiRepo.find({where: {user: {user_id:user_id}}});

        if(notifications.length > 0){
            let res_notifications : ResNotification[];
            res_notifications = notifications.map((noti) => {
                let res_noti = new ResNotification();
                res_noti.notification_id = noti.notification_id;
                res_noti.notification_content = noti.content;
                res_noti.date_sent = noti.date_sent;
                return res_noti;
            });
            return res_notifications;
        }
        return [];
    }
}
