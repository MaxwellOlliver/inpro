import { Module } from '@nestjs/common';
import { HashModule } from '@shared/infra/security/hash/hash.module';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { ImageProcessorModule } from '@shared/infra/image-processor/image-processor.module';
import { FileStorageModule } from '@shared/infra/file-storage/file-storage.module';
import { IUserRepository } from './domain/interfaces/repositories/user.repository';
import { ProfileRepository } from './domain/interfaces/repositories/profile.repository';
import { ProfileReadStore } from './application/read-stores/profile.read-store';
import { UserRepositoryProvider } from './infra/providers/user-repository.provider';
import { RegistrationRepositoryProvider } from './infra/providers/registration-repository.provider';
import { ProfileRepositoryProvider } from './infra/providers/profile-repository.provider';
import { ProfileReadStoreProvider } from './infra/providers/profile-read-store.provider';
import { RegisterHandler } from './application/commands/register/register.handler';
import { UpdateProfileHandler } from './application/commands/update-profile/update-profile.handler';
import { DeleteProfileHandler } from './application/commands/delete-profile/delete-profile.handler';
import { SetProfileMediaHandler } from './application/commands/set-profile-media/set-profile-media.handler';
import { CheckUsernameAvailabilityHandler } from './application/queries/check-username-availability/check-username-availability.handler';
import { RetrieveProfileHandler } from './application/queries/retrieve-profile/retrieve-profile.handler';
import { UploadProfileMediaService } from './application/services/upload-profile-media.service';
import { RegisterController } from './presentation/http/controllers/register.controller';
import { ProfileController } from './presentation/http/controllers/profile.controller';

@Module({
  imports: [HashModule, PrismaModule, ImageProcessorModule, FileStorageModule],
  providers: [
    UserRepositoryProvider,
    RegistrationRepositoryProvider,
    ProfileRepositoryProvider,
    ProfileReadStoreProvider,
    RegisterHandler,
    UpdateProfileHandler,
    DeleteProfileHandler,
    SetProfileMediaHandler,
    CheckUsernameAvailabilityHandler,
    RetrieveProfileHandler,
    UploadProfileMediaService,
  ],
  controllers: [RegisterController, ProfileController],
  exports: [IUserRepository, ProfileRepository, ProfileReadStore],
})
export class AccountModule {}
