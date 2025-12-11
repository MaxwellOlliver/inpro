import { Module } from '@nestjs/common';
import { ProfileRepositoryProvider } from './infra/providers/profile-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { ProfileReadStoreProvider } from './infra/providers/profile-read-store.provider';

@Module({
  imports: [PrismaModule],
  providers: [ProfileRepositoryProvider, ProfileReadStoreProvider],
  exports: [ProfileRepositoryProvider, ProfileReadStoreProvider],
})
export class ProfileModule {}
