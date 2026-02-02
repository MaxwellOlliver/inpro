import { Err, Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '@modules/auth/domain/interfaces/repositories/session.repository.interface';
import { Session } from '@modules/auth/domain/aggregates/session.aggregate';
import { User } from '@modules/account/domain/aggregates/user.aggregate';
import { IUserRepository } from '@modules/account/domain/interfaces/repositories/user.repository';
import { EncryptGateway } from '@shared/application/gateways/encrypt.gateway';
import { TokenGateway } from '@shared/application/gateways/token.gateway';
import { TokenPayload } from '@modules/auth/domain/value-objects/token-payload.value-object';

@Injectable()
export class GetRefreshTokenSessionService {
  constructor(
    private readonly encryptGateway: EncryptGateway,
    private readonly tokenGateway: TokenGateway,
    private readonly sessionRepository: ISessionRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(
    refreshToken: string,
  ): Promise<Result<{ session: Session; user: User }>> {
    const tokenPayload =
      this.tokenGateway.verify<Record<string, string>>(refreshToken);

    if (tokenPayload.isErr()) {
      return Err(new Error('Invalid refresh token'));
    }

    const originalTokenPayload = tokenPayload.unwrap();

    const tokenPayloadVO = TokenPayload.create({
      sid: originalTokenPayload.sid,
      sub: originalTokenPayload.sub,
      profileId: originalTokenPayload.profileId,
      email: originalTokenPayload.email,
      deviceId: originalTokenPayload.deviceId,
      jti: originalTokenPayload.jti,
    }).unwrap();

    const sessionResult = await this.sessionRepository.findById(
      tokenPayloadVO.get('sid'),
    );

    if (sessionResult.isErr()) {
      return Err(new Error('Invalid refresh token'));
    }

    const session = sessionResult.unwrap();

    const refreshTokenDigest =
      this.encryptGateway.generateHmacDigest(refreshToken);

    const isRefreshTokenValid = this.encryptGateway.compareHmacDigests(
      refreshTokenDigest.unwrap(),
      session.get('refreshTokenDigest').get('value'),
    );

    if (!isRefreshTokenValid.unwrap()) {
      return Err(new Error('Invalid refresh token. Not match'));
    }

    if (
      session.isExpired ||
      session.isRevoked ||
      session.get('userId').value() !== tokenPayloadVO.get('sub')
    ) {
      return Err(new Error('Session is invalid'));
    }

    const user = await this.userRepository.findById(
      session.get('userId').value(),
    );

    if (user.isErr()) {
      return Err(new Error('User not found'));
    }

    return Ok({ session, user: user.unwrap() });
  }
}
