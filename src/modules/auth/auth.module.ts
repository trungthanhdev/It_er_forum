import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';


@Module({
    imports: [
      JwtModule.register({
      global: true,
      signOptions: { expiresIn: '60s' },
    }),
    ],
    providers:[AuthService],
    controllers: [AuthController],
    exports: [AuthService]
})
export class AuthModule {}
