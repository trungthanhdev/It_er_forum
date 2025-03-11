import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'dto/login.dto';
import { UserService } from '../user/user.service';
import { RegisterDto } from 'dto/register.dto';
import * as bcrypt from 'bcrypt';

import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvalidTokenEntity } from '../blacklist/entities/invalidatedToken.entity';
import { BlacklistService } from '../blacklist/blacklist.service';
import { BlacklistDto } from 'dto/blacklist.dto';
import { User } from '../user/entities/user.entity';
import { object } from '@hapi/joi';
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

            const access_token =  await this.jwtService.signAsync(access_payload,{secret: process.env.JWT_TOKEN})
            const refresh_token = await this.jwtService.signAsync(refresh_payload,{secret: process.env.JWT_REFRESH_TOKEN, expiresIn: '1d'})
            return {access_token,refresh_token}

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

    async logout(refresh_token: any, access_token: any){
        try {
            if(typeof refresh_token === 'object'){
                refresh_token = refresh_token.refresh_token
            }
            let accessObject = await this.objectToken(refresh_token, false)
            await this.blacklistService.addToBlacklist(accessObject)

            let refreshObject = await this.objectToken(access_token,true)
            await this.blacklistService.addToBlacklist(refreshObject)

        } catch (error) {
            throw error
        }
    }

    async objectToken(token: string, isAccess: boolean){
        let tokenVerify 
        if(isAccess){
            tokenVerify = await this.jwtService.verifyAsync(
                token,{secret: process.env.JWT_TOKEN})
        }else{
            tokenVerify = await this.jwtService.verifyAsync(
                token,{secret: process.env.JWT_REFRESH_TOKEN})
        }
        let token_id = tokenVerify.id
        let user = await this.userService.getUserById(tokenVerify.sub)
        let object = ({token_id, user})
        return object
    }
   
}

