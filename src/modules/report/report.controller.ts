import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportSubject, ReportTitle } from 'global/enum.global';
// import { JwtAuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
import { Subject } from 'rxjs';
import { SendReportDto } from 'dto/sendReport.dto';
import { JwtAuthGuard } from 'guard/jwt.guard';
@Controller('/api/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/admin/:subject')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
  async getReportbySubject(@Param("subject") subject : string){
      let subjectModify = subject as ReportSubject;
      return await this.reportService.getReportbySubject(subjectModify) 
  }

  @Get('/admin/search/:subject')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(JwtAuthGuard)
  getReportDetail(
    @Param("subject") subject: string,
    @Param("id") id : string)
  {
      console.log("Controller received request:", subject, id); 
      const modifySubjectDetail = subject as ReportSubject
      return this.reportService.getReportDetail(modifySubjectDetail, id)              
  }

  @Post("/:subject")
  @UseGuards(JwtAuthGuard)
  sendReport(@Param("subject") subject: string,
             @Body() sendReportDto: SendReportDto)
  {
    let modifySubject = subject as ReportSubject
    if(!Object.values(ReportSubject).includes(modifySubject)){
      throw new BadRequestException("Invalid subject!")
    }
    if(!Object.values(ReportTitle).includes(sendReportDto.report_title)){
      throw new BadRequestException("Invalid report title!")
    }
    return this.reportService.sendReport(modifySubject, sendReportDto)
  }
  

  @Delete("/skip-report/:report_id")
  deleteReport(@Param("report_id") report_id: string){
    return this.reportService.deleteReport(report_id)
  }
}
