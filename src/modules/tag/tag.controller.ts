import { Body, Controller, Get, Param } from '@nestjs/common';
import { TagService } from './tag.service';
import { TagName } from 'global/enum.global';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

}
