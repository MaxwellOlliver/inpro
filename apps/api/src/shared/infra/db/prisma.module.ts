import { Module } from '@nestjs/common';
import { PrismaGateway } from './prisma.gateway';

@Module({
  providers: [PrismaGateway],
  exports: [PrismaGateway],
})
export class PrismaModule {}
