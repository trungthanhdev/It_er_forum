
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
    const token = request.headers.authorization?.split(' ')[1]

    if(!token){
      throw new UnauthorizedException("Token not found")
    }

    const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_TOKEN})

    const user = await this.userService.findByEmail(payload.email)

    if(!user){
      throw new BadRequestException("Please login again!")
    }
    
    request.currentUser = user
    
    } catch (error) {
      if(error instanceof UnauthorizedException || error instanceof BadRequestException){
        throw error
      }
      throw new UnauthorizedException("Token expired!")
    }
    return true
  }
}
