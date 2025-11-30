import { Result } from '@inpro/core';

export abstract class CacheGateway {
  abstract get(key: string): Promise<Result<string | null, Error>>;
  abstract set(
    key: string,
    value: string,
    ttl?: number,
  ): Promise<Result<void, Error>>;
  abstract del(key: string): Promise<Result<void, Error>>;
}
