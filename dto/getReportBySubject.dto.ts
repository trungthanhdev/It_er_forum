import { IsString } from "class-validator"

export class GetReportBySubjectDto{
    @IsString()
    report_id: string
    
    @IsString()
    reported_user_id: string

    @IsString()
    reported_user_name: string

    @IsString()
    ava_img_path: string

    @IsString()
    report_title: string
}
    
