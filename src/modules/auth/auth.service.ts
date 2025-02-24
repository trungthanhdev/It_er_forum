import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';
import { HttpCode, HttpMessage } from 'global/enum.global';
import { emitWarning } from 'process';
import { log } from 'console';
import e from 'express';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService
    ){}

    async login(loginDto : LoginDto){
        try {
            const user = await this.userService.findByEmail(loginDto.email)
            console.log(user)
        if(!user){
            throw new BadRequestException("Email or password is wrong")
        }

        const isMatch = await bcrypt.compare(loginDto.password,user.password );
        console.log(isMatch)
        console.log("password nhap vao :", loginDto.password)
        console.log("password trong db :", user.password)
        if(!isMatch){
            throw new UnauthorizedException("Wrong password")
        }
        
        const payload = {
            id: user.user_id,
            role: user.role,
            email: user.email
        }

        const access_token =  await this.jwtService.signAsync(payload,{secret: process.env.JWT_TOKEN})

        return {msg: "Login successfully!",
            HttpCode: HttpCode.SUCCESS,
            HttpMessage: HttpMessage.SUCCESS,
            access_token}
        } catch (error) {
            if(error instanceof UnauthorizedException || error instanceof BadRequestException){
                throw error
            }
            throw new Error("Inveral server")
        }
        
    }

    async register(registerDto: RegisterDto){
        try {
            const findByEmail = await this.userService.findByEmail(registerDto.email)

            if(findByEmail){throw new BadRequestException("Email already exist!")}

            const hashPassword = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = hashPassword

            const saveUser = await this.userService.createUser(registerDto)

            const payload = {
                id: saveUser.user_id,
                role: saveUser.role,
                email: saveUser.email
            }

            const access_token =  await this.jwtService.signAsync(payload,{secret: process.env.JWT_TOKEN})
            return {msg: "Register successfully!",
                    HttpCode: HttpCode.SUCCESS,
                    HttpMessage: HttpMessage.SUCCESS,
                    access_token}

        } catch (error) {
            if(error instanceof BadRequestException){
                throw error
            }
            throw new BadRequestException('Something went wrong')
        }

    }
}
