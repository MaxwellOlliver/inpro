import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';
import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';

export class CreateCommentCommand extends Command<Result<Comment>> {
  constructor(
    public readonly profileId: string,
    public readonly postId: string,
    public readonly text: string,
    public readonly mentions: {
      mentionedProfileId: string;
      startIndex: number;
      endIndex: number;
      surfaceText: string;
    }[],
    public readonly parentCommentId?: string,
  ) {
    super();
  }
}
