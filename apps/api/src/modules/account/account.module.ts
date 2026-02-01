import { IUserRepository } from './domain/interfaces/repositories/user.repository.interface';
import { RegisterHandler } from './application/commands/user/handlers/register.handler';
import { HashModule } from '@shared/infra/security/hash/hash.module';
import { RegisterController } from './presentation/controllers/user/register.controller';
import { UserRepositoryProvider } from './infra/providers/user-repository.provider';
import { RegistrationRepositoryProvider } from './infra/providers/registration-repository.provider';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';

@Module({
  imports: [HashModule, PrismaModule],
  providers: [
    UserRepositoryProvider,
    RegistrationRepositoryProvider,
    RegisterHandler,
  ],
  controllers: [RegisterController],
  exports: [IUserRepository],
})
export class AccountModule {}
