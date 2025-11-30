import { Module } from '@nestjs/common';
import { BcryptHashProvider } from './providers/bcrypt-hash.provider';
import { BCRYPT_HASH } from './tokens/bcrypt.tokens';

@Module({
  providers: [BcryptHashProvider],
  exports: [BCRYPT_HASH],
})
export class BcryptHashModule {}
