import { Module } from '@nestjs/common';
import { PrismaLifecycleService } from './services/prisma-lifecycle.service';
import { PrismaClientProvider } from './providers/prisma-client.provider';

@Module({
  imports: [],
  providers: [PrismaClientProvider, PrismaLifecycleService],
  exports: [PrismaClientProvider],
})
export class PrismaModule {}
