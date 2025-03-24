import { Controller, Get } from '@nestjs/common';
import { SubscribedTagsService } from './subscribed_tags.service';

@Controller('subscribe-tags')
export class SubscribedTagsController {
  constructor(private readonly subscribeTagsService: SubscribedTagsService) {}

}
