import { Err, Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import { Session } from '@modules/auth/domain/aggregates/session.aggregate';
import { ISessionRepository } from '@modules/auth/domain/interfaces/repositories/session.repository.interface';
import { TokenGateway } from '@shared/application/gateways/token.gateway';
import { TokenPayload } from '@modules/auth/domain/value-objects/token-payload.value-object';

@Injectable()
export class RetrieveSessionByTokenService {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly tokenGateway: TokenGateway,
  ) {}

  async execute(accessToken: string): Promise<Result<Session>> {
    const decodedResult =
      this.tokenGateway.verify<Record<string, string>>(accessToken);

    if (decodedResult.isErr()) {
      return Err(new Error('Invalid token'));
    }

    const originalDecoded = decodedResult.unwrap();

    const decoded = TokenPayload.create({
      sid: originalDecoded.sid,
      sub: originalDecoded.sub,
      profileId: originalDecoded.profileId,
      email: originalDecoded.email,
      deviceId: originalDecoded.deviceId,
      jti: originalDecoded.jti,
    }).unwrap();

    const sessionResult = await this.sessionRepository.findDeviceSession(
      decoded.get('sid'),
      decoded.get('sub'),
      decoded.get('deviceId'),
    );

    if (sessionResult.isErr()) {
      return Err(new Error('Session not found'));
    }

    const session = sessionResult.unwrap();

    if (session.isExpired) {
      return Err(new Error('Session expired'));
    }

    if (session.isRevoked) {
      return Err(new Error('Session revoked'));
    }

    return Ok(session);
  }
}
