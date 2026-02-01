import { Module } from '@nestjs/common';
import { ProfileRepositoryProvider } from './infra/providers/profile-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { ProfileReadStoreProvider } from './infra/providers/profile-read-store.provider';
import { ProfileController } from './presentation/http/controllers/profile.controller';
import { ImageProcessorModule } from '@shared/infra/image-processor/image-processor.module';
import { CheckUsernameAvailabilityHandler } from './application/queries/check-username-availability/check-username-availability.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { DeleteProfileHandler } from './application/commands/delete-profile/delete-profile.handler';
import { RetrieveProfileHandler } from './application/queries/retrieve-profile/retrieve-profile.handler';
import { SetProfileMediaHandler } from './application/commands/set-profile-media/set-profile-media.handler';
import { UploadProfileMediaService } from './application/services/upload-profile-media.service';
import { FileStorageModule } from '@shared/infra/file-storage/file-storage.module';

@Module({
  imports: [
    PrismaModule,
    ImageProcessorModule,
    FileStorageModule,
  ],
  providers: [
    ProfileRepositoryProvider,
    ProfileReadStoreProvider,
    CheckUsernameAvailabilityHandler,
    UpdateProfileHandler,
    DeleteProfileHandler,
    SetProfileMediaHandler,
    RetrieveProfileHandler,
    UploadProfileMediaService,
  ],
  exports: [ProfileRepositoryProvider, ProfileReadStoreProvider],
  controllers: [ProfileController],
})
export class ProfileModule {}
