import { Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { TokenPayload } from '@modules/auth/domain/value-objects/token-payload.value-object';
import { EnvService } from '@config/env/env.service';
import { randomUUID } from 'crypto';
import { TokenGateway } from '@shared/application/gateways/token.gateway';

@Injectable()
export class GenerateTokensService {
  constructor(
    private readonly tokenGateway: TokenGateway,
    private readonly envService: EnvService,
  ) {}

  execute(
    sessionId: string,
    user: User,
    profileId: string,
    deviceId: string,
  ): Result<{ accessToken: string; refreshToken: string }> {
    const { id, email } = user.toObject();

    const payload = TokenPayload.create({
      sub: id,
      profileId,
      email: email.value,
      sid: sessionId,
      deviceId: deviceId,
      jti: randomUUID(),
    }).unwrap();

    const accessToken = this.tokenGateway.sign(payload.toObject(), {
      expiresIn: this.envService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
      secret: this.envService.get('JWT_SECRET'),
    });
    const refreshToken = this.tokenGateway.sign(payload.toObject(), {
      expiresIn: this.envService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
      secret: this.envService.get('JWT_SECRET'),
    });

    return Ok({ accessToken, refreshToken });
  }
}
