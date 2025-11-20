import { Result } from '@inpro/core';

export abstract class IHashService {
  abstract generateHash(payload: string): Promise<Result<string>>;
  abstract compareHash(
    payload: string,
    hashed: string,
  ): Promise<Result<boolean>>;
}
