import { Module } from '@nestjs/common';
import { ProfileRepositoryProvider } from './infra/providers/profile-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { ProfileReadStoreProvider } from './infra/providers/profile-read-store.provider';
import { ProfileController } from './presentation/http/controllers/profile.controller';
import { ImageProcessorModule } from '@shared/infra/image-processor/image-processor.module';

@Module({
  imports: [PrismaModule, ImageProcessorModule],
  providers: [ProfileRepositoryProvider, ProfileReadStoreProvider],
  exports: [ProfileRepositoryProvider, ProfileReadStoreProvider],
  controllers: [ProfileController],
})
export class ProfileModule {}
