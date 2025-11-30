// infra/cache/redis-client.provider.ts
import { EnvService } from '@config/env/env.service';
import { Logger, Provider } from '@nestjs/common';
import { Redis } from 'ioredis';
import { REDIS_CLIENT, RedisClient } from '../tokens/redis.tokens';

export const RedisClientProvider: Provider = {
  provide: REDIS_CLIENT,
  useFactory: (env: EnvService, logger: Logger): RedisClient => {
    const client = new Redis({
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
    });

    client.on('connect', () => {
      logger.log('Redis connected');
    });

    client.on('error', (err) => {
      logger.error('Redis error', err);
    });

    return client;
  },
  inject: [EnvService, Logger],
};
