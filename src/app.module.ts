import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    EventModule,
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/reminder-app-db'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
