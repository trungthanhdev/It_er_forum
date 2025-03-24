import { PartialType } from '@nestjs/swagger';
import { MaxLength, IsNumber, IsDate, IsOptional } from 'class-validator';
import { RegisterDto } from './register.dto';

export class UpdateUserDto  {    
        @MaxLength(50)  
        @IsOptional()
        user_name?: string
    
        @MaxLength(20)
        @IsOptional()
        first_name?: string
    
        @MaxLength(20)
        @IsOptional()
        last_name?: string
        
        @IsNumber()
        @IsOptional()
        phone_num?: string
    
        @IsDate()
        @IsOptional()
        age?: number
}
