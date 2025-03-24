import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';
import { BlacklistService } from '../blacklist/blacklist.service';
import { MailerService } from '@nestjs-modules/mailer';
import { PostService } from '../post/post.service';
import { SubscribedTagsService } from '../subscribed_tags/subscribed_tags.service';
import { ReportService } from '../report/report.service';
import { ReportSubject, UserStatus } from 'global/enum.global';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly blacklistService: BlacklistService,
                private readonly mailerService: MailerService,
                private readonly postService: PostService,
                private readonly subscribedTagsService: SubscribedTagsService,
                private readonly reportService: ReportService
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
        
        if(user.status === UserStatus.BANNED){
            throw new UnauthorizedException("Account has been banned!")
        }

        const payload_accesstoken = {
            sub: user.user_id,
            id: uuidv4(),
            role: user.role,
            status:user.status,
            email: user.email
        }
        const payload_refreshtoken = {
            sub: user.user_id,
            id: uuidv4(),
            role: user.role,
            status:user.status,
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
                status:saveUser.status,
                email: saveUser.email
            }
            const refresh_payload = {
                id: uuidv4(),
                sub: saveUser.user_id,
                role: saveUser.role,
                status:saveUser.status,
                email: saveUser.email
            }

            const access_token =  await this.jwtService.signAsync(access_payload,{secret: process.env.JWT_TOKEN, expiresIn: process.env.JWT_TOKEN_EXPIRY})
            const refresh_token = await this.jwtService.signAsync(refresh_payload,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY})
            
            await this.subscribedTagsService.subscribeTagDefault(saveUser)
            
            return {access_token,refresh_token}

        } catch (error) {
            if(error instanceof BadRequestException){
                throw error
            }
            throw new InternalServerErrorException(error.message || 'Something went wrong');
        }

    }

    async refreshToken(role : string, email : string, user_id: string,status: string){
        try {
            // const token = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_TOKEN})
            // // console.log(token)
            // if(!token){
            //     throw new UnauthorizedException("Refresh_token not found")
            // }

        
            const payload = {
                id: uuidv4(),
                sub: user_id,
                role: role,
                status: status,
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

    async sendEmailtoUserBanned(user_id: string,report_id: string ,subject: ReportSubject){
        if(!Object.values(ReportSubject).includes(subject)){
            throw new BadRequestException("Invalid report subject!")
        }
        let user = await this.userService.findUserById(user_id)
        if(!user){
            throw new NotFoundException("User not found!")
        }
        let report = await this.reportService.getReportDetail(subject,report_id)
        if(!report){
            throw new NotFoundException("Report not found")
        }

        this.mailerService.sendMail({
            to: user.email, 
            subject: 'Tài khoản bị khóa', 
            template: "userBanned",
            context: {
                first_name: Boolean(user.first_name) ? user.first_name: "Trống",
                last_name: Boolean(user.last_name) ? user.last_name : "Trống",
                email: Boolean(user.email) ? user.email : "Trống",
                age: Boolean(user.age) ? user.age : "Trống",
                country: Boolean(user.country) ? user.country : "Trống",
                phone_num: Boolean(user.phone_num) ? user.phone_num : "Trống",
                status: user.status,
                title_report: report.report_title,
                report_content: report.report_body,
                date_reported: report.date_reported,
                subject: report.subject
            }
        })
    }
   
    
}

