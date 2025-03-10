
import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from 'src/modules/blacklist/blacklist.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService,
              private readonly blacklistService: BlacklistService
  ){}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();    
    try {
    const access_token = request.headers.authorization?.split(' ')[1]

    if(!access_token ){
      throw new UnauthorizedException("Token not found")
    }

    const access_payload = await this.jwtService.verifyAsync(access_token, {secret: process.env.JWT_TOKEN})

    if(await this.blacklistService.findTokenInBlacklist(access_payload.id)){
      throw new UnauthorizedException("Please login again!")
    }

    const user = await this.userService.findByEmail(access_payload.email)

    if(!user){
      throw new BadRequestException("Please login again!")
    }
    
    request.currentUser = user
    request.tokens = {access_token}
    
    } catch (error) {
      if(error instanceof UnauthorizedException || error instanceof BadRequestException){
        throw error
      }
      throw new UnauthorizedException("Token expired!")
    }
    return true
  }
}
