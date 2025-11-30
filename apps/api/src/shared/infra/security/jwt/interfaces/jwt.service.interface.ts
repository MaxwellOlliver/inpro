import { Result } from '@inpro/core';

export interface SignOptions {
  expiresIn?: string;
  secret?: string;
}

export interface VerifyOptions {
  secret?: string;
}

export abstract class IJwtService {
  abstract sign(payload: unknown, options?: SignOptions): string;
  abstract verify<T = unknown>(
    token: string,
    options?: VerifyOptions,
  ): Result<T>;
}
