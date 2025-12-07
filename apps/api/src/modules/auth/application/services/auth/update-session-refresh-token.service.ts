import { Ok, Result } from '@inpro/core';
import { Injectable } from '@nestjs/common';
import { ISessionRepository } from '@modules/auth/domain/interfaces/repositories/session.repository.interface';
import { Session } from '@modules/auth/domain/aggregates/session.aggregate';
import { RefreshTokenDigest } from '@modules/auth/domain/value-objects/refresh-token-hash.value-object';
import { EncryptGateway } from '@shared/application/gateways/encrypt.gateway';

@Injectable()
export class UpdateSessionRefreshTokenService {
  constructor(
    private readonly sessionRepository: ISessionRepository,
    private readonly encryptGateway: EncryptGateway,
  ) {}

  async execute(session: Session, refreshToken: string): Promise<Result<void>> {
    const refreshTokenDigest =
      this.encryptGateway.generateHmacDigest(refreshToken);

    const newRefreshTokenDigest = RefreshTokenDigest.create(
      refreshTokenDigest.unwrap(),
    ).unwrap();

    session.refresh(newRefreshTokenDigest);

    await this.sessionRepository.save(session);

    return Ok(undefined);
  }
}
