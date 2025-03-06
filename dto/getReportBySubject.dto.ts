import { IsString } from "class-validator"

export class GetReportBySubjectDto{
    @IsString()
    user_id: string

    @IsString()
    user_name: string

    @IsString()
    ava_img_path: string

    @IsString()
    report_title: string
}
    
