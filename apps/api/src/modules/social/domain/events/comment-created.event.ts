import { PlainAggregate } from '@inpro/core';
import type { Comment } from '../aggregates/comment.aggregate';

export class CommentCreatedEvent {
  constructor(public readonly comment: PlainAggregate<Comment>) {}
}
