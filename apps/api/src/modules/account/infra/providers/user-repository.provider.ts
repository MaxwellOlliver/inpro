import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';

export const UserRepositoryProvider = {
  provide: IUserRepository,
  useClass: PrismaUserRepository,
};
