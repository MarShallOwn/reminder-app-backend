import { Module } from '@nestjs/common';
import { RefreshToken, RefreshTokenSchema } from './refreshToken.model';
import { MongooseModule } from '@nestjs/mongoose';
import { RefreshTokenService } from './refreshToken.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RefreshToken.name, schema: RefreshTokenSchema }]),
  ],
  providers: [RefreshTokenService],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}