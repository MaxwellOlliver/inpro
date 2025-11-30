import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { CacheGateway } from '@shared/application/gateways/cache.gateway';
import { REDIS_CACHE } from './redis/tokens/redis.tokens';

@Module({
  imports: [RedisModule],
  providers: [
    {
      provide: CacheGateway,
      useExisting: REDIS_CACHE,
    },
  ],
  exports: [RedisModule, CacheGateway],
})
export class CacheModule {}
