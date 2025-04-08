import { IsEnum, IsOptional, IsString } from "class-validator"
import { ReportTitle } from "global/enum.global"

export class SendReportDto{
    @IsEnum(ReportTitle)
    report_title: ReportTitle

    report_body: string

    @IsString()
    reported_user_id: string

    @IsString()
    @IsOptional()
    post_id?: string

    @IsString()
    @IsOptional()
    comment_id?: string
}