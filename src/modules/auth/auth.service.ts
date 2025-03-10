import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';
import { HttpCode, HttpMessage } from 'global/enum.global';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidTokenEntity } from '../blacklist/entities/invalidatedToken.entity';
import { BlacklistService } from '../blacklist/blacklist.service';
import { BlacklistDto } from 'dto/blacklist.dto';
@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
                private readonly userService: UserService,
                private readonly blacklistService: BlacklistService
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

        const access_token =  await this.jwtService.signAsync(payload_accesstoken,{secret: process.env.JWT_TOKEN})
        const refresh_token = await this.jwtService.signAsync(payload_refreshtoken,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '1d'})
        
    
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

    async register(registerDto: RegisterDto){
        try {
            const findByEmail = await this.userService.findByEmail(registerDto.email)

            if(findByEmail){throw new BadRequestException("Email already exist!")}

            const hashPassword = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = hashPassword

            const saveUser = await this.userService.createNewAdmin(registerDto)
            
            // const payload = {
            //     id: saveUser.user_id,
            //     role: saveUser.role,
            //     email: saveUser.email
            // }

            // const access_token =  await this.jwtService.signAsync(payload,{secret: process.env.JWT_TOKEN})
            // const refresh_token = await this.jwtService.signAsync(payload,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '1d'})
            return {msg: "Register successfully!",
                    HttpCode: HttpCode.SUCCESS,
                    HttpMessage: HttpMessage.SUCCESS,
                    // access_token,
                    // refresh_token}
            }

        } catch (error) {
            if(error instanceof BadRequestException){
                throw error
            }
            throw new InternalServerErrorException(error.message || 'Something went wrong');
        }

    }

    async refreshToken(refreshToken : string){
        try {
            const token = await this.jwtService.verifyAsync(refreshToken, {secret: process.env.JWT_REFRESH_TOKEN})
            // console.log(token)
            if(!token){
                throw new UnauthorizedException("Refresh_token not found")
            }
        
            const payload = {
                id: token.id,
                role: token.role,
                email: token.email
            }

            const access_token = await this.jwtService.signAsync(payload,{secret: process.env.JWT_TOKEN})

            return {access_token}
        } catch (error) {
            if(error instanceof UnauthorizedException){
                throw error
            }
            throw new HttpException( error.message  || "Refresh token is not valid", HttpStatus.BAD_REQUEST)
        }
    }

    async logout(refresh_token: any){
        try {
            // console.log(refresh_token);
            // console.log("vao service logout");
            if(typeof refresh_token === 'object'){
                refresh_token = refresh_token.refresh_token
                // console.log(refresh_token);    
            }

            const payload = await this.jwtService.verifyAsync(
                refresh_token,{secret: process.env.JWT_REFRESH_TOKEN})
            // console.log("giai ma xong");
                
            let refreshtoken_id = payload.id
            let user_id = payload.sub
            let user = await this.userService.getUserById(user_id)
            // let res = user.user_id
            let object  = {refreshtoken_id, user} 
            // console.log(user_id);
            // console.log(refreshtoken_id);
        
            await this.blacklistService.addToBlacklist(object)
            // console.log("Save to refresh_token to blacklist successfully!"); 
        } catch (error) {
            throw error
        }
    }
   
}

