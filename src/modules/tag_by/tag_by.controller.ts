import { Controller, Param, Post } from '@nestjs/common';
import { TagByService } from './tag_by.service';

@Controller('/api/v1/tag-by')
export class TagByController {
  constructor(private readonly tagByService: TagByService) {}
}
