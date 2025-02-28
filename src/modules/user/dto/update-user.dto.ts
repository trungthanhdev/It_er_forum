import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, MaxLength, IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class UpdateUserDto {    
        @MaxLength(50)  
        user_name: string
    
        @MaxLength(20)
        first_name: string
    
        @MaxLength(20)
        last_name: string
        
        @IsNumber()
        phone_num: number
        
        @MaxLength(20)
        country: string
    
        @IsDate()
        dob: Date
}
