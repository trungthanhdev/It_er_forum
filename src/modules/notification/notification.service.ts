import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
        private readonly userService: UserService
    )
    {}


    async getNotificationByUserId(user_id:string) : Promise<ResNotification[]>{
        if (!isUUID(user_id)) {
            throw new BadRequestException("Invalid post_id format!");
        }
        const notifications: NotificationEntity[] =  await this.notifiRepo.find({where: {user: {user_id:user_id}}});

        if(notifications.length > 0){
            let res_notifications : ResNotification[] = await Promise.all(
                notifications.map(async (noti) => {
                    let res_noti = new ResNotification();
                    res_noti.notification_id = noti.notification_id;
                    res_noti.notification_content =  await this.generateJsonStringToObj(noti.content)
                    res_noti.notification_content = noti.content;
                    res_noti.date_sent = noti.date_sent;
                    return res_noti;
                })
            )   
            return res_notifications;
        }
        return [];
    }

    async createNotification(user_id: string, notification_content: any){
        if (!isUUID(user_id)) {
            throw new BadRequestException("Invalid post_id format!");
        }
        const user = await this.userService.findUserById(user_id)
        if(!user){
            throw new NotFoundException("User not found!")
        }

        let content: string = ""
        let payload = {}
        if(notification_content.is_comment){
            payload = {
                content : notification_content.content,
                ava_img_path : notification_content.ava_img_path,
                user_name: notification_content.user_name,
                post_id: notification_content.post_id,
            }
            content =  JSON.stringify(payload)
        }else{ 
            payload = {
                content: notification_content.content, 
                post_id: notification_content.post_id
            }
            content =  JSON.stringify(payload)
        }

        let noti_element = this.notifiRepo.create({
            content: content,
            date_sent: new Date(),
            user: user
        })
        await this.notifiRepo.save(noti_element)

        const resNoti = new ResNotification()
        resNoti.notification_id = noti_element.notification_id
        resNoti.notification_content = payload
        resNoti.date_sent =  noti_element.date_sent
        return resNoti
    }

    async generateJsonStringToObj(noti_content : string){
        let noti_content_obj = JSON.parse(noti_content);
        return noti_content_obj;
    }
}

