import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';


@Module({
    imports: [
      JwtModule.register({
      global: true,
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => UserModule)
    ],
    providers:[AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
