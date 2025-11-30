import { Result } from '@inpro/core';

export interface SignOptions {
  expiresIn?: string;
  secret?: string;
}

export interface VerifyOptions {
  secret?: string;
}

export abstract class TokenGateway {
  abstract sign(
    payload: Record<string, unknown>,
    options?: SignOptions,
  ): string;
  abstract verify<T = Record<string, unknown>>(
    token: string,
    options?: VerifyOptions,
  ): Result<T, Error>;
}
