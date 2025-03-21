import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import refreshConfig from 'src/config/refresh.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    @Inject(refreshConfig.KEY)
    refresConfiguration: ConfigType<typeof refreshConfig>
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
    return {id: payload.id, user_id: payload.sub, email: payload.email, role: payload.role};
  }

}