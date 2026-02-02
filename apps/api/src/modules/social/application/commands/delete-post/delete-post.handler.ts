import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeletePostCommand } from './delete-post.command';
import { PostRepository } from '@modules/social/domain/interfaces/repositories/post.repository';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<Result<void>> {
    const profileResult = await this.profileRepository.findByUserId(
      command.userId,
    );

    if (profileResult.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    const profile = profileResult.unwrap();

    const postResult = await this.postRepository.findById(command.postId);

    if (postResult.isErr()) {
      return Err(
        new BusinessException('Post not found', 'POST_NOT_FOUND', 404),
      );
    }

    const post = postResult.unwrap();

    if (post.get('profileId').value() !== profile.toObject().id) {
      return Err(
        new BusinessException(
          'You are not allowed to delete this post',
          'FORBIDDEN',
          403,
        ),
      );
    }

    if (post.get('deletedAt') !== null) {
      return Err(
        new BusinessException(
          'Post is already deleted',
          'POST_ALREADY_DELETED',
          400,
        ),
      );
    }

    post.softDelete();

    const saveResult = await this.postRepository.save(post);

    if (saveResult.isErr()) {
      return Err(
        new BusinessException('Error deleting post', 'POST_DELETE_ERROR', 422),
      );
    }

    return Ok();
  }
}
