import { MaxLength, IsNumber, IsDate } from 'class-validator';

export class UpdateUserDto {    
        @MaxLength(50)  
        user_name: string
    
        @MaxLength(20)
        first_name: string
    
        @MaxLength(20)
        last_name: string
        
        @IsNumber()
        phone_num: string
        
        @MaxLength(20)
        country: string
    
        @IsDate()
        dob: Date
}
