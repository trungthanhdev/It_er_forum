import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshConfig from 'src/config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { BlacklistService } from 'src/modules/blacklist/blacklist.service';
import { UserStatus } from 'global/enum.global';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(refreshConfig.KEY)
    refresConfiguration: ConfigType<typeof refreshConfig>,
    private readonly blacklistService: BlacklistService
  ) {
    console.log('Refresh Config:', refresConfiguration);
    super({
      // Lấy token từ header Authorization theo dạng Bearer
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: refresConfiguration.secret ?? 'this_is_not_a_token',
    });
  }

  async validate(payload: any) {
    // Ở đây bạn có thể kiểm tra thêm điều kiện nếu cần
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