import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';
import { ReportSubject } from 'global/enum.global';
import { error } from 'console';
import { GetReportBySubjectDto } from 'dto/getReportBySubject.dto';

@Injectable()
export class ReportService {
    constructor(
        @InjectRepository(Report)
        private readonly reportRepo: Repository<Report>,
        private readonly postService: PostService,
        private readonly userService: UserService
    ){}

   async getReportbySubject(subject: ReportSubject){
      if(!Object.values(ReportSubject).includes(subject)){
        throw new BadRequestException("Invalid subject!")
      }
      let report = await this.reportRepo.find({
        where : {subject : subject},
        relations: ["user", "post","comment"],
       })
       if(!report){
        throw error
       }
       let response = report.map((report) => {
            let resElement = new GetReportBySubjectDto()
            resElement.user_id = report.user.user_id,
            resElement.user_name = report.user.user_name,
            resElement.report_title = report.report_title,
            resElement.ava_img_path = report.user.ava_img_path
            return resElement
       })
       return response
   }

   async searchSortReport(
    subject: ReportSubject,
    search_value: string,
    sort_by: Date | null,
    is_ascending: Boolean){
        try {
        if(!Object.values(ReportSubject).includes(subject)){
            throw new BadRequestException(`Invalid subject, subject must be "User" or "Post" or "Comment"!`)
        }
        
        let object = await this.reportRepo.find({
            where: {subject : subject}
        })
        // console.log(object);
        let response = object.map((obj) => {
            return {
                report_title: obj.report_title,
                subject: obj.subject,
                date_reported:obj.date_reported
            }})

        if(search_value){
            // console.log("chay vao search_value");
            response = response.filter(report => report.report_title.toLowerCase().includes(search_value.toLowerCase()) )
            // || report.report_body.toLocaleLowerCase().includes(search_value.toLowerCase())) 
        }

        if(sort_by !== null){
            response.sort((a, b) => {
                // console.log("chay vao sort");
                return is_ascending ? a.date_reported.getTime() - b.date_reported.getTime()
                    : b.date_reported.getTime() - a.date_reported.getTime();
            })
        }
        return response
        
        } catch (error) {
            throw error
        }
   }

   async getReportDetail(subject: ReportSubject, id: string){
        if(!Object.values(ReportSubject).includes(subject)){
            throw new BadRequestException("Invalid Subject!")
        }
        const report = await this.reportRepo.findOne({
            where : {subject : subject, report_id : id},
            relations: ["user", "post","comment"]})
        if(!report){
            throw error
        }
        switch (subject) {
            case ReportSubject.USER:
                return {
                    reported_user_id : report.user.user_id,
                    reported_id: report.report_id,
                    report_title: report.report_title,
                    report_body: report.report_body,
                    subject: subject,
                    date_reported: report.date_reported,
                    content: {
                        user_id: report?.user?.user_id,
                        ava_img_path: report?.user?.ava_img_path,
                        email: report?.user?.email,
                        user_name: report?.user?.user_name,
                        status: report?.user?.status,
                        role: report?.user?.role
                    }
                }
            case ReportSubject.COMMENT:
                return {
                    reported_user_id : report.user.user_id,
                    reported_id: report.report_id,
                    report_title: report.report_title,
                    report_body: report.report_body,
                    subject: subject,
                    date_reported: report.date_reported,
                    content: {
                        post_id: report?.post?.post_id,
                        post_title: report?.post?.post_title,
                        post_content: report?.post?.post_content,
                        img_url : report?.post?.img_url,
                        comment_id: report?.comment?.comment_id,
                        comment_content: report?.comment?.comment_content,
                        comment_parent_id: report?.comment?.comment_parent
                    }
                }
            case ReportSubject.POST:
                return{
                    reported_user_id : report.user.user_id,
                    reported_id: report.report_id,
                    report_title: report.report_title,
                    report_body: report.report_body,
                    subject: subject,
                    date_reported: report.date_reported,
                    content: {
                        post_id: report?.post?.post_id, 
                        post_title: report?.post?.post_title,
                        post_content: report?.post?.post_content,
                        img_url : report?.post?.img_url,
                        date_updated: report?.post?.date_updated,
                    }
                }
            default:
                throw new error
        }
   }
}
