import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { ConfigModule } from '@nestjs/config';
import { DATABASE_URI } from "./const/databaseURI"

console.log(DATABASE_URI)


@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    EventModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(DATABASE_URI, {
      dbName: process.env.DATABASE_NAME,
      authSource: process.env.DATABASE_AUTH_SOURCE
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


// mongodb://reminder-app-user:GrandTurismo_23@127.0.0.1:27018/reminder-app-db?authSource=admin