import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TokenExpiredError } from "jsonwebtoken";

export class JwtRefreshAuthGuard extends AuthGuard("jwt-refresh"){
    
    handleRequest<TUser = any>(err: any, user: any, info: any, context: ExecutionContext, status?: any): TUser {
        console.log('Handle Request called with:', { err, user, info, status });
        // console.log(info.name);
        if (info) {
          if (
            info instanceof TokenExpiredError ||
            info.name === 'TokenExpiredError'
          ) {
            throw new UnauthorizedException('Expired Token');
          }
          throw new UnauthorizedException();
        }
        if (err || !user) {
          console.log(err);
          throw new UnauthorizedException();
        }
        return user;
    }
}