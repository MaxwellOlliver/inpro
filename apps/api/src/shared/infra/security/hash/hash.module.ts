import { BcryptHashModule } from './bcrypt/bcrypt.module';
import { Module } from '@nestjs/common';
import { HashGateway } from '@shared/application/gateways/hash.gateway';
import { BCRYPT_HASH } from './bcrypt/tokens/bcrypt.tokens';

@Module({
  imports: [BcryptHashModule],
  providers: [
    {
      provide: HashGateway,
      useExisting: BCRYPT_HASH,
    },
  ],
  exports: [HashGateway, BcryptHashModule],
})
export class HashModule {}
