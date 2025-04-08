import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('/api/v1/notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }
}
