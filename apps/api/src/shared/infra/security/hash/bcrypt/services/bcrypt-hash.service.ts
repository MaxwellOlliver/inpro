import { Result } from '@inpro/core';
import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { HashGateway } from '@shared/application/gateways/hash.gateway';

@Injectable()
export class HashService implements HashGateway {
  async generateHash(payload: string): Promise<Result<string>> {
    try {
      const salt = await bcrypt.genSalt(8);
      const hash = await bcrypt.hash(payload, salt);

      return Result.ok(hash);
    } catch (error) {
      return Result.err(error);
    }
  }

  async compareHash(payload: string, hashed: string): Promise<Result<boolean>> {
    try {
      const isMatch = await bcrypt.compare(payload, hashed);

      return Result.ok(isMatch);
    } catch (error) {
      return Result.err(error);
    }
  }
}
