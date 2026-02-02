import { IRegistrationRepository } from '@modules/account/domain/interfaces/repositories/registration.repository';
import { PrismaRegistrationRepository } from '../repositories/prisma-registration.repository';

export const RegistrationRepositoryProvider = {
  provide: IRegistrationRepository,
  useClass: PrismaRegistrationRepository,
};
