import { Controller } from '@nestjs/common';
import { TagByService } from './tag_by.service';

@Controller('tag-by')
export class TagByController {
  constructor(private readonly tagByService: TagByService) {}
}
