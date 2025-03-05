import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

   async searchSortReport(
    subject: ReportSubject,
    search_value: string,
    sort_by: Date | null,
    is_ascending: Boolean){
        try {
            //loc theo subject
        if(!Object.values(ReportSubject).includes(subject)){
            throw new BadRequestException(`Invalid subject, subject must be "User" or "Post" or "Comment"!`)
        }
        // console.log(typeof subject);
        // console.log(typeof search_value);
        // console.log(typeof sort_by);
        // console.log(typeof is_ascending);
        // console.log( subject);
        // console.log( search_value);
        // console.log( sort_by);
        // console.log( is_ascending);
        
        let object = await this.reportRepo.find({
            where: {subject : subject}
        })
        // console.log(object);
        
        //loc theo search
        if(search_value){
            // console.log("chay vao search_value");
            object = object.filter(report => report.report_title.toLowerCase().includes(search_value.toLowerCase()) ||
                report.report_body.toLocaleLowerCase().includes(search_value.toLowerCase())) 
            // if(object.length === 0){
            //     throw new NotFoundException(`There is no report for value ${search_value}`)
            // }
        }
        //sort_by(neu co)
        if(sort_by !== null){
            object.sort((a, b) => {
                // console.log("chay vao sort");
                return is_ascending ? a.date_reported.getTime() - b.date_reported.getTime()
                    : b.date_reported.getTime() - a.date_reported.getTime();
            })
        }
        return object
        
        } catch (error) {
            throw error
        }
    }

}
