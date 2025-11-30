import { Result } from '@inpro/core';

export abstract class EncryptGateway {
  abstract generateHmacDigest(payload: string): Result<string>;
  abstract compareHmacDigests(a: string, b: string): Result<boolean>;
}
