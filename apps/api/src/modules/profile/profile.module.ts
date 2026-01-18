import { Module } from '@nestjs/common';
import { ProfileRepositoryProvider } from './infra/providers/profile-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { ProfileReadStoreProvider } from './infra/providers/profile-read-store.provider';
import { ProfileController } from './presentation/http/controllers/profile.controller';
import { ImageProcessorModule } from '@shared/infra/image-processor/image-processor.module';
import { CreateProfileHandler } from './application/commands/create-profile/create-profile.handler';
import { CheckUsernameAvailabilityHandler } from './application/queries/check-username-availability/check-username-availability.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { DeleteProfileHandler } from './application/commands/delete-profile/delete-profile.handler';
import { RetrieveProfileHandler } from './application/queries/retrieve-profile/retrieve-profile.handler';
import { AccountModule } from '@modules/account/account.module';

@Module({
  imports: [PrismaModule, ImageProcessorModule, AccountModule],
  providers: [
    ProfileRepositoryProvider,
    ProfileReadStoreProvider,
    CreateProfileHandler,
    CheckUsernameAvailabilityHandler,
    UpdateProfileHandler,
    DeleteProfileHandler,
    RetrieveProfileHandler,
  ],
  exports: [ProfileRepositoryProvider, ProfileReadStoreProvider],
  controllers: [ProfileController],
})
export class ProfileModule {}
