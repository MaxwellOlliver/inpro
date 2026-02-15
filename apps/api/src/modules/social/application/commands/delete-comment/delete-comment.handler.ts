import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteCommentCommand } from './delete-comment.command';
import { CommentRepository } from '@modules/social/domain/interfaces/repositories/comment.repository';
import { Err, Ok, Result } from '@inpro/core';
import { BusinessException } from '@shared/exceptions/business.exception';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(command: DeleteCommentCommand): Promise<Result<void>> {
    const commentResult = await this.commentRepository.findById(
      command.commentId,
    );

    if (commentResult.isErr()) {
      return Err(
        new BusinessException('Comment not found', 'COMMENT_NOT_FOUND', 404),
      );
    }

    const comment = commentResult.unwrap();

    if (comment.get('profileId').value() !== command.profileId) {
      return Err(
        new BusinessException(
          'You are not allowed to delete this comment',
          'FORBIDDEN',
          403,
        ),
      );
    }

    if (comment.get('deletedAt') !== null) {
      return Err(
        new BusinessException(
          'Comment is already deleted',
          'COMMENT_ALREADY_DELETED',
          400,
        ),
      );
    }

    comment.softDelete();

    const saveResult = await this.commentRepository.save(comment);

    if (saveResult.isErr()) {
      return Err(
        new BusinessException(
          'Error deleting comment',
          'COMMENT_DELETE_ERROR',
          422,
        ),
      );
    }

    return Ok();
  }
}
