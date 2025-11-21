import { IUserRepository } from './domain/interfaces/repositories/user.repository.interface';
import { CreateUserHandler } from './application/commands/user/handlers/create-user.handler';
import { HashModule } from '@shared/security/hash/hash.module';
import { CreateUserController } from './presentation/controllers/user/create-user.controller';
import { UserRepositoryProvider } from './infra/providers/user-repository.provider';
import { Module } from '@nestjs/common';
import { PrismaModule } from '@shared/gateways/db/prisma.module';

@Module({
  imports: [HashModule, PrismaModule],
  providers: [UserRepositoryProvider, CreateUserHandler],
  controllers: [CreateUserController],
  exports: [IUserRepository],
})
export class AccountModule {}
