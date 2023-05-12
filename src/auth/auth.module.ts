import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenModule } from 'src/refreshToken/refreshToken.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}

// 43200 seconds = 12 hours
// normally it should be 15 mins === 900s
