import { Module } from '@nestjs/common';
import { RedisCacheService } from './services/redis-cache.service';
import { RedisClientProvider } from './providers/redis-client.provider';

@Module({
  providers: [RedisCacheService, RedisClientProvider],
  exports: [RedisCacheService],
})
export class CacheModule {}
