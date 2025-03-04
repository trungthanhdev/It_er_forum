import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportSubject } from 'global/enum.global';
@Controller('/api/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/:subject')
  getReportbySubject(@Param("subject") subject : string){
    switch (subject) {
      case ReportSubject.USER:
        return this.reportService.getUserReport();
      case ReportSubject.POST:
        return this.reportService.getPostReport();
      case ReportSubject.COMMENT:
        return this.reportService.getCommentReport();
      default:
        return { message: 'Subject must be "User", "Comment", or "Post"' };
    }
  }
}
