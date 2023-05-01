import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { DATABASE_URI } from 'src/const/databaseURI';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: `${DATABASE_URI}/${process.env.DATABASE_NAME}?authSource=${process.env.DATABASE_AUTH_SOURCE}`,
        },
      },
    });
  }
}
