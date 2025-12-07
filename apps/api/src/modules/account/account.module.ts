import { IUserRepository } from './domain/interfaces/repositories/user.repository.interface';
import { CreateUserHandler } from './application/commands/user/handlers/create-user.handler';
import { HashModule } from '@shared/infra/security/hash/hash.module';
import { CreateUserController } from './presentation/controllers/user/create-user.controller';
import { UserRepositoryProvider } from './infra/providers/user-repository.provider';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';

@Module({
  imports: [HashModule, PrismaModule],
  providers: [UserRepositoryProvider, CreateUserHandler],
  controllers: [CreateUserController],
  exports: [IUserRepository],
})
export class AccountModule {}
