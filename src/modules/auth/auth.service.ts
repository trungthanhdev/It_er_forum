import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService){}

}
