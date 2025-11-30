import { Module } from '@nestjs/common';
import { JwtModule } from './jwt/jwt.module';
import { HashModule } from './hash/hash.module';
import { EncryptModule } from './encrypt/encrypt.module';
import { BCRYPT_HASH } from './hash/bcrypt/tokens/bcrypt.tokens';
import { HashGateway } from '@shared/application/gateways/hash.gateway';

@Module({
  imports: [EncryptModule, HashModule, JwtModule],
  providers: [
    {
      provide: HashGateway,
      useExisting: BCRYPT_HASH,
    },
  ],
  exports: [EncryptModule, HashModule, JwtModule, HashGateway],
})
export class SecurityModule {}
