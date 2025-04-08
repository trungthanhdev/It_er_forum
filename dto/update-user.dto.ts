import { PartialType } from '@nestjs/swagger';
import { MaxLength, IsNumber, IsDate } from 'class-validator';
import { RegisterDto } from './register.dto';

export class UpdateUserDto extends PartialType(RegisterDto) {    
        // @MaxLength(50)  
        // user_name: string
    
        // @MaxLength(20)
        // first_name: string
    
        // @MaxLength(20)
        // last_name: string
        
        // @IsNumber()
        // phone_num: string
        
        // @MaxLength(20)
        // country: string
    
        // @IsDate()
        // age: number
}
