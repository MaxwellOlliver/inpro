import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { MongooseModule } from './mongoose/mongoose.module';
@Module({
  imports: [PrismaModule, MongooseModule],
  exports: [PrismaModule, MongooseModule],
})
export class DbModule {}
