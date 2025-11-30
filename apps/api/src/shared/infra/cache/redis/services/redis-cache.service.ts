import { CacheGateway } from '@shared/application/gateways/cache.gateway';
import { Result } from '@inpro/core';
import { Inject, Injectable, OnModuleDestroy } from '@nestjs/common';
import { REDIS_CLIENT, RedisClient } from '../tokens/redis.tokens';

@Injectable()
export class RedisCacheService implements CacheGateway, OnModuleDestroy {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: RedisClient) {}

  onModuleDestroy() {
    this.redis.disconnect();
  }

  async get(key: string): Promise<Result<string | null, Error>> {
    return await Result.fromPromise(this.redis.get(key));
  }

  async set(
    key: string,
    value: string,
    ttl?: number,
  ): Promise<Result<void, Error>> {
    if (ttl) {
      return await Result.fromPromise(this.redis.set(key, value, 'EX', ttl));
    } else {
      return await Result.fromPromise(this.redis.set(key, value));
    }
  }

  async del(key: string): Promise<Result<void, Error>> {
    return await Result.fromPromise(this.redis.del(key));
  }
}
