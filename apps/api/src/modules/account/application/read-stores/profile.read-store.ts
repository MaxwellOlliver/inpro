import { Result } from '@inpro/core';

export abstract class ProfileReadStore {
  abstract checkUsernameAvailability(
    userName: string,
  ): Promise<Result<boolean>>;
}
