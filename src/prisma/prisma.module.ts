import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // make the module global for all other modules without the need to import them
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
