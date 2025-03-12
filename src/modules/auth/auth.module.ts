import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { BlacklistModule } from '../blacklist/blacklist.module';


@Module({
    imports: [
      JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule),
    BlacklistModule,
    ],
    providers:[AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
