import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportSubject } from 'global/enum.global';
import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import { Subject } from 'rxjs';
@Controller('/api/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}



  @Get('/admin/:subject')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async getReportbySubject(@Param("subject") subject : string){
      let subjectModify = subject as ReportSubject;
      return await this.reportService.getReportbySubject(subjectModify) 
  }

  @Get('/admin/search/:subject')
  searchSortReport(
    @Param("subject") subject: string,
    @Query("search_value") search_value: string,
    @Query("sort_by") sort_by: string,
    @Query("is_ascending") is_ascending: string
  ){
      const modifySubject = subject as ReportSubject
      const modifySortBy = sort_by ? new Date(sort_by) : null
      const modifyIsAscending = is_ascending === 'true'
      return this.reportService.searchSortReport(modifySubject,search_value,modifySortBy,modifyIsAscending)
  }

  @Get("/admin/detail/:subject/:id") 
  getReportDetail(
    @Param("subject") subject: string,
    @Param("id") id : string)
  {
      console.log("Controller received request:", subject, id); 
      const modifySubjectDetail = subject as ReportSubject
      return this.reportService.getReportDetail(modifySubjectDetail, id)              
  }
  
}
