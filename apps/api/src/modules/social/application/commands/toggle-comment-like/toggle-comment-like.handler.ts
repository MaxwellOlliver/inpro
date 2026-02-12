import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ToggleCommentLikeCommand } from './toggle-comment-like.command';
import { Err, Result } from '@inpro/core';
import { LikeStore, LikeToggleResult } from '../../gateways/like.store.gateway';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(ToggleCommentLikeCommand)
export class ToggleCommentLikeHandler
  implements ICommandHandler<ToggleCommentLikeCommand>
{
  constructor(private readonly likeStore: LikeStore) {}

  async execute(
    command: ToggleCommentLikeCommand,
  ): Promise<Result<LikeToggleResult>> {
    const result = await this.likeStore.toggleCommentLike(
      command.profileId,
      command.commentId,
    );

    if (result.isErr()) {
      return Err(
        new BusinessException(
          'Failed to toggle comment like',
          'COMMENT_LIKE_TOGGLE_FAILED',
          500,
        ),
      );
    }

    return result;
  }
}
