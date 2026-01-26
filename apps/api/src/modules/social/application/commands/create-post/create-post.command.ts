import { Command } from '@nestjs/cqrs';
import { Result } from '@inpro/core';
import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export class CreatePostCommand extends Command<Result<Post>> {
  constructor(
    public readonly profileId: string,
    public readonly text: string,
    public readonly visibility: PostVisibility,
    public readonly mediaIds?: string[],
    public readonly parentId?: string,
  ) {
    super();
  }
}
