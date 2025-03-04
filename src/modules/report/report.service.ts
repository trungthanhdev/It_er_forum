import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,
        private readonly postService: PostService,
        private readonly userService: UserService
    ){}

   async getUserReport(){
        return await this.userService.findAllUser()
   }

   getPostReport(){
        return `reported post`
   }

   getCommentReport(){
        return `reported Comment`
   }
}
