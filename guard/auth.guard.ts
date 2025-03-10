
import { Injectable, CanActivate, ExecutionContext, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService,
              private readonly jwtService: JwtService
  ){}
  async canActivate(
    context: ExecutionContext,
  ):  Promise<boolean> {
    const request = context.switchToHttp().getRequest();    
    try {
    const access_token = request.headers.authorization?.split(' ')[1]

    // const refresh_token = request.headers["refresh-token"]
    if(!access_token ){
      throw new UnauthorizedException("Token not found")
    }

    const access_payload = await this.jwtService.verifyAsync(access_token, {secret: process.env.JWT_TOKEN})
    // const refresh_payload = await this.jwtService.verifyAsync(access_token, {secret: process.env.JWT_REFRESH_TOKEN})

    const user = await this.userService.findByEmail(access_payload.email)

    if(!user){
      throw new BadRequestException("Please login again!")
    }
    
    request.currentUser = user
    request.tokens = {access_token }//, refresh_token}
    
    } catch (error) {
      if(error instanceof UnauthorizedException || error instanceof BadRequestException){
        throw error
      }
      throw new UnauthorizedException("Token expired!")
    }
    return true
  }
}
