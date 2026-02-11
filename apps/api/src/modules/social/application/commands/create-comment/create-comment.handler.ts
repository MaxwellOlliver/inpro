import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateCommentCommand } from './create-comment.command';
import { CommentRepository } from '@modules/social/domain/interfaces/repositories/comment.repository';
import { PostRepository } from '@modules/social/domain/interfaces/repositories/post.repository';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { Err, ID, Ok, Result } from '@inpro/core';
import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import { Mention } from '@modules/social/domain/value-objects/mention.value-object';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly postRepository: PostRepository,
    private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<Result<Comment>> {
    const profileId = ID.create(command.profileId).unwrap();

    const profile = await this.profileRepository.findById(profileId.value());

    if (profile.isErr()) {
      return Err(
        new BusinessException('Profile not found', 'PROFILE_NOT_FOUND', 404),
      );
    }

    const post = await this.postRepository.findById(command.postId);

    if (post.isErr()) {
      return Err(
        new BusinessException('Post not found', 'POST_NOT_FOUND', 404),
      );
    }

    let parentCommentId: ID | null = null;

    if (command.parentCommentId) {
      const parentComment = await this.commentRepository.findById(
        command.parentCommentId,
      );

      if (parentComment.isErr()) {
        return Err(
          new BusinessException(
            'Parent comment not found',
            'PARENT_COMMENT_NOT_FOUND',
            404,
          ),
        );
      }

      const parent = parentComment.unwrap();

      if (parent.get('parentCommentId') !== null) {
        return Err(
          new BusinessException(
            'Cannot reply to a reply. Only root-level comments can have replies',
            'NESTED_REPLY_NOT_ALLOWED',
            400,
          ),
        );
      }

      parentCommentId = ID.create(command.parentCommentId).unwrap();
    }

    const mentions: Mention[] = [];

    for (const mentionData of command.mentions) {
      const mentionedProfile = await this.profileRepository.findById(
        mentionData.mentionedProfileId,
      );

      if (mentionedProfile.isErr()) {
        return Err(
          new BusinessException(
            `Mentioned profile ${mentionData.mentionedProfileId} not found`,
            'MENTIONED_PROFILE_NOT_FOUND',
            404,
          ),
        );
      }

      const mention = Mention.create({
        mentionedProfileId: ID.create(mentionData.mentionedProfileId).unwrap(),
        startIndex: mentionData.startIndex,
        endIndex: mentionData.endIndex,
        surfaceText: mentionData.surfaceText,
      });

      if (mention.isErr()) {
        return Err(
          new BusinessException(
            mention.unwrapErr().message,
            'INVALID_MENTION',
            400,
          ),
        );
      }

      mentions.push(mention.unwrap());
    }

    const comment = Comment.create({
      profileId,
      postId: ID.create(command.postId).unwrap(),
      parentCommentId,
      text: command.text,
      mentions,
    });

    if (comment.isErr()) {
      return Err(
        new BusinessException(
          comment.unwrapErr().message,
          'COMMENT_CREATION_ERROR',
          400,
        ),
      );
    }

    const savedComment = await this.commentRepository.save(comment.unwrap());

    if (savedComment.isErr()) {
      return Err(
        new BusinessException(
          'Error saving comment',
          'COMMENT_SAVING_ERROR',
          422,
        ),
      );
    }

    const saved = savedComment.unwrap();
    saved.commit();

    return Ok(saved);
  }
}
