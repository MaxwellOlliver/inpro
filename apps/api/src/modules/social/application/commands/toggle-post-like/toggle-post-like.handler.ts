import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TogglePostLikeCommand } from './toggle-post-like.command';
import { Err, Result } from '@inpro/core';
import { LikeStore, LikeToggleResult } from '../../gateways/like.store.gateway';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(TogglePostLikeCommand)
export class TogglePostLikeHandler
  implements ICommandHandler<TogglePostLikeCommand>
{
  constructor(private readonly likeStore: LikeStore) {}

  async execute(
    command: TogglePostLikeCommand,
  ): Promise<Result<LikeToggleResult>> {
    const result = await this.likeStore.togglePostLike(
      command.profileId,
      command.postId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException(
          'Failed to toggle post like',
          'POST_LIKE_TOGGLE_FAILED',
          500,
        ),
      );
    }

    return result;
  }
}
