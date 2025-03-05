import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { ReportSubject } from 'global/enum.global';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,
        private readonly postService: PostService,
        private readonly userService: UserService
    ){}

   async getReportbySubject(subject: ReportSubject){
        console.log(subject);
      if(!Object.values(ReportSubject).includes(subject)){
        throw new BadRequestException("Invalid subject!")
      }
      return await this.reportRepo.find({
        where : {subject : subject},
        relations: ["user", "post","comment"],
        select: {
            report_id: true,
            report_title: true,
            user: {
                user_id: true,
                user_name:true
            },
            post:{
                post_id: true
            },
            comment: {
                comment_id: true
            }
        }})
   }

}
