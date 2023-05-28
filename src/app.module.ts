import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';



@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    EventModule,
    MongooseModule.forRoot(`mongodb://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOSTNAME}:${process.env.DATABASE_PORT}`, {
      dbName: process.env.DATABASE_NAME,
      authSource: process.env.DATABASE_AUTH_SOURCE
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// mongodb://reminder-app-user:GrandTurismo_23@127.0.0.1:27018/reminder-app-db?authSource=admin