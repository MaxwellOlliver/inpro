import { Module } from '@nestjs/common';
import { RedisCacheService } from './services/redis-cache.service';
import { RedisClientProvider } from './providers/redis-client.provider';
import { REDIS_CACHE } from './tokens/redis.tokens';

@Module({
  imports: [],
  providers: [
    RedisClientProvider,
    {
      provide: REDIS_CACHE,
      useExisting: RedisCacheService,
    },
  ],
  exports: [REDIS_CACHE],
})
export class RedisModule {}
