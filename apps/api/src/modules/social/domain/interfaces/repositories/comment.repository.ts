import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import { Result } from '@inpro/core';

export abstract class CommentRepository {
  abstract save(comment: Comment): Promise<Result<Comment>>;
  abstract findById(id: string): Promise<Result<Comment>>;
}
