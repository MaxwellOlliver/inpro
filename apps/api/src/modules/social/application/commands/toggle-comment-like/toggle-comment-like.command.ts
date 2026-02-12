import { Result } from '@inpro/core';
import { Command } from '@nestjs/cqrs';
import { LikeToggleResult } from '../../gateways/like.store.gateway';

export class ToggleCommentLikeCommand extends Command<
  Result<LikeToggleResult>
> {
  constructor(
    public readonly profileId: string,
    public readonly commentId: string,
  ) {
    super();
  }
}
