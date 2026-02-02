import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreatePostCommand } from './create-post.command';
import { PostRepository } from '@modules/social/domain/interfaces/repositories/post.repository';
import { Err, ID, Ok, Result } from '@inpro/core';
import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { BusinessException } from '@shared/exceptions/business.exception';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { MediaRepository } from '@modules/media/domain/repositories/media.repository';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
    private readonly mediaRepository: MediaRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<Result<Post>> {
    const profileId = ID.create(command.profileId).unwrap();

    const profile = await this.profileRepository.findById(profileId.value());

    if (profile.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    if (command.parentId) {
      const parentPost = await this.postRepository.findById(command.parentId);

      if (parentPost.isErr()) {
        return Err(
          new BusinessException(
            'Parent post not found',
            'PARENT_POST_NOT_FOUND',
            404,
          ),
        );
      }
    }

    const mediaIds: ID[] = [];

    if (command.mediaIds && command.mediaIds.length > 0) {
      if (command.mediaIds.length > 4) {
        return Err(
          new BusinessException(
            'Maximum 4 media items allowed',
            'MAX_MEDIA_EXCEEDED',
            400,
          ),
        );
      }

      for (const mediaIdStr of command.mediaIds) {
        const mediaId = ID.create(mediaIdStr).unwrap();
        const mediaResult = await this.mediaRepository.findById(mediaId);

        if (mediaResult.isErr()) {
          return Err(
            new BusinessException(
              `Media with id ${mediaIdStr} not found`,
              'MEDIA_NOT_FOUND',
              404,
            ),
          );
        }

        const media = mediaResult.unwrap();

        if (!media.isReady()) {
          return Err(
            new BusinessException(
              `Media with id ${mediaIdStr} is not ready for use`,
              'MEDIA_NOT_READY',
              400,
            ),
          );
        }

        mediaIds.push(mediaId);
      }
    }

    const post = Post.create({
      profileId,
      text: command.text,
      visibility: command.visibility,
      parentId: command.parentId ? ID.create(command.parentId).unwrap() : null,
      mediaIds,
    });

    if (post.isErr()) {
      return Err(
        new BusinessException(
          post.unwrapErr().message,
          'POST_CREATION_ERROR',
          400,
        ),
      );
    }

    const postSaved = await this.postRepository.save(post.unwrap());

    if (postSaved.isErr()) {
      return Err(
        new BusinessException('Error saving post', 'POST_SAVING_ERROR', 422),
      );
    }

    return Ok(postSaved.unwrap());
  }
}
