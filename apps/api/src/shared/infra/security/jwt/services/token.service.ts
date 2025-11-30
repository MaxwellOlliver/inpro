import { Result } from '@inpro/core';
import {
  SignOptions,
  TokenGateway,
  VerifyOptions,
} from '@shared/application/gateways/token.gateway';
import { EnvService } from '@config/env/env.service';
import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService, JwtSignOptions } from '@nestjs/jwt';

@Injectable()
export class TokenService implements TokenGateway {
  private readonly secret: string;

  constructor(
    private readonly config: EnvService,
    private readonly jwtService: NestJwtService,
  ) {
    this.secret = this.config.get('JWT_SECRET');
  }

  sign(payload: Record<string, unknown>, options?: SignOptions): string {
    const data = payload as Record<string, string>;

    return this.jwtService.sign(data, {
      ...(options?.expiresIn && { expiresIn: options.expiresIn }),
      secret: options?.secret ?? this.secret,
    } as JwtSignOptions);
  }

  verify<T = Record<string, unknown>>(
    token: string,
    options?: VerifyOptions,
  ): Result<T, Error> {
    try {
      const result = this.jwtService.verify<Record<string, string>>(token, {
        secret: options?.secret ?? this.secret,
      });

      return Result.ok(result as T);
    } catch (error) {
      return Result.err(error as Error);
    }
  }
}
