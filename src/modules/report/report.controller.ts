import { Controller, Get, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ReportService } from './report.service';
import { ReportSubject } from 'global/enum.global';
import { AuthGuard } from 'guard/auth.guard';
import { RoleGuard } from 'guard/role.guard';
@Controller('/api/v1/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('/:subject')
  @UseGuards(new RoleGuard(['ADMIN']))
  @UseGuards(AuthGuard)
  async getReportbySubject(@Param("subject") subject : string){
      let subjectModify = subject as ReportSubject;
      return await this.reportService.getReportbySubject(subjectModify) 
  }
}
