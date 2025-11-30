import { HashService } from '../services/bcrypt-hash.service';
import { BCRYPT_HASH } from '../tokens/bcrypt.tokens';

export const BcryptHashProvider = {
  provide: BCRYPT_HASH,
  useClass: HashService,
};
