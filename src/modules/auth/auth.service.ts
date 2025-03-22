import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';
import { BlacklistService } from '../blacklist/blacklist.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Cron } from '@nestjs/schedule';
import { PostService } from '../post/post.service';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly blacklistService: BlacklistService,
                private readonly mailerService: MailerService,
                private readonly postService: PostService
    ){}

    async login(loginDto : LoginDto){
        try {
            const user = await this.userService.findByEmail(loginDto.email)
        
        if(!user){
            throw new BadRequestException("Email doesn't exist!")
        }

        const isMatch = await bcrypt.compare(loginDto.password,user.password);
        
        if(!isMatch){
            throw new UnauthorizedException("Wrong password")
        }
        
        const payload_accesstoken = {
            sub: user.user_id,
            id: uuidv4(),
            role: user.role,
            email: user.email
        }
        const payload_refreshtoken = {
            sub: user.user_id,
            id: uuidv4(),
            role: user.role,
            email: user.email
        }

        const access_token =  await this.jwtService.signAsync(payload_accesstoken,{secret: process.env.JWT_TOKEN, expiresIn: process.env.JWT_TOKEN_EXPIRY})
        const refresh_token = await this.jwtService.signAsync(payload_refreshtoken,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY})
        
    
        return {
            access_token,
            refresh_token}
        } catch (error) {
            if(error instanceof UnauthorizedException || error instanceof BadRequestException){
                throw error
            }
            throw new Error(error.message || "Inveral server")
        }
        
    }

    //register
    async createUser(registerDto: RegisterDto){
        try {
            const findByEmail = await this.userService.findByEmail(registerDto.email)

            if(findByEmail){throw new BadRequestException("Email already exist!")}

            const hashPassword = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = hashPassword

            const saveUser = await this.userService.createNewAdmin(registerDto)
            
            const access_payload = {
                id: uuidv4(),
                sub: saveUser.user_id,
                role: saveUser.role,
                email: saveUser.email
            }
            const refresh_payload = {
                id: uuidv4(),
                sub: saveUser.user_id,
                role: saveUser.role,
                email: saveUser.email
            }

            const access_token =  await this.jwtService.signAsync(access_payload,{secret: process.env.JWT_TOKEN, expiresIn: process.env.JWT_TOKEN_EXPIRY})
            const refresh_token = await this.jwtService.signAsync(refresh_payload,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY})
            return {access_token,refresh_token}

        } catch (error) {
            if(error instanceof BadRequestException){
                throw error
            }
            throw new InternalServerErrorException(error.message || 'Something went wrong');
        }

    }

    async refreshToken(role : string, email : string){
        try {
            // const token = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_TOKEN})
            // // console.log(token)
            // if(!token){
            //     throw new UnauthorizedException("Refresh_token not found")
            // }
        
            const payload = {
                id: uuidv4(),
                role: role,
                email: email
            }

            const access_token = await this.jwtService.signAsync(payload,{secret: process.env.JWT_TOKEN, expiresIn: process.env.JWT_TOKEN_EXPIRY})

            return {access_token}
        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw error
            }
            throw new HttpException( error.message  || "Refresh token is not valid", HttpStatus.BAD_REQUEST)
        }
    }

    async logout(refresh_token: string, access_token_id: string, user_id: string){
        try {
            
            let user = await this.userService.findUserById(user_id);
            let refresh_id = await this.objectToken(refresh_token, false)
            await this.blacklistService.addToBlacklist({token_id: refresh_id, user})
            
            await this.blacklistService.addToBlacklist({token_id: access_token_id, user})

        } catch (error) {
            throw error
        }
    }

    async objectToken(token: string, isAccess: boolean){
     try {
        let refresh = token["refresh_token"];
        
        const tokenVerify = await this.jwtService.verifyAsync(refresh, {
            secret: process.env.JWT_REFRESH_TOKEN
        })
        console.log(tokenVerify);
        
        
        let token_id = tokenVerify.id
        return token_id
     } catch (error) {
        throw new BadRequestException("Invalid token!")
     }
    }
    // @Cron('*/5 * * * * *')
    async sendEmailReport(){
        console.log("gui gmail...")
        const postRemaining = await this.postService.counPostRemaining()
        const admins = await this.userService.findAdmin()
        const sendAdmin = admins.map(admin => {
            return this.mailerService.sendMail({
                to: admin.email, 
                subject: 'Testing Nest MailerModule ✔', 
                template: "mailReport",
                context: {
                    username: admin.email,
                    date: new Date(),
                    reportCount: postRemaining
                }
            }).then().catch(err => {console.error(`Lỗi khi gửi email đến ${admin.email}:`, err);})
            })
        await Promise.all(sendAdmin)
    }
   
}

