import { Module } from '@nestjs/common';
import { EnvModule } from '@config/env/env.module';
import { EncryptGateway } from '@shared/application/gateways/encrypt.gateway';
import { EncryptProvider } from './providers/encrypt.provider';

@Module({
  imports: [EnvModule],
  providers: [EncryptProvider],
  exports: [EncryptGateway],
})
export class EncryptModule {}
