import { IRegistrationRepository } from '@modules/account/domain/interfaces/repositories/registration.repository.interface';
import { RegistrationRepository } from '../repositories/registration.repository.impl';

export const RegistrationRepositoryProvider = {
  provide: IRegistrationRepository,
  useClass: RegistrationRepository,
};
