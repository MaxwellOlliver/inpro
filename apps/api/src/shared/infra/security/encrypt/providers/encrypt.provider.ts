import { EncryptGateway } from '@shared/application/gateways/encrypt.gateway';
import { EncryptService } from '../services/encrypt.service';

export const EncryptProvider = {
  provide: EncryptGateway,
  useClass: EncryptService,
};
