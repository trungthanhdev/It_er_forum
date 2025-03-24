import { Body, Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagName } from 'global/enum.global';

@Controller('api/v1/tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

}
