import { PrismaClient } from '@generated/prisma/client';
import { Err, Ok, Result } from '@inpro/core';
import { ProfileReadStore } from '@modules/profile/application/read-stores/profile.read-store';
import { Inject } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';

export class PrismaProfileReadStore implements ProfileReadStore {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async checkUsernameAvailability(userName: string): Promise<Result<boolean>> {
    const result = await Result.fromPromise(
      this.prisma.profile.findUnique({
        where: { userName },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    return Ok(result.unwrap() === null);
  }
}
