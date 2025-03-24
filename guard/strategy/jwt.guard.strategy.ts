import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from 'src/config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { BlacklistService } from 'src/modules/blacklist/blacklist.service';
import { UserStatus } from 'global/enum.global';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject(jwtConfig.KEY)
    jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly blacklistService: BlacklistService
  ) {
    console.log('JWT Config:', jwtConfiguration);
    super({
      // Lấy token từ header Authorization theo dạng Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.secret ?? 'this_is_not_a_token',
    });
  }

    async validate(payload: any) {
        console.log("Validate");
        // Ở đây bạn có thể kiểm tra thêm điều kiện nếu cần
        //Check thêm black list
        const isInBlacklist = await this.blacklistService.findTokenInBlacklist(payload.id);
        if(isInBlacklist){
          throw new UnauthorizedException();
        }

        if(payload.status === UserStatus.BANNED){
            throw new UnauthorizedException("Account has been banned!")
        }
        return {id: payload.id, user_id: payload.sub, email: payload.email, role: payload.role,status: payload.status};
    }


}
