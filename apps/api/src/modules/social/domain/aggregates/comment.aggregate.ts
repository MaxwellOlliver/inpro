import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import { Mention } from '../value-objects/mention.value-object';
import { CommentCreatedEvent } from '../events/comment-created.event';

interface CommentProps {
  id?: ID;
  profileId: ID;
  postId: ID;
  parentCommentId?: ID | null;
  text: string;
  mentions: Mention[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type CreateCommentProps = Omit<
  CommentProps,
  'id' | 'createdAt' | 'updatedAt'
> & {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Comment extends Aggregate<CommentProps> {
  private constructor(props: CommentProps) {
    super(props);
  }

  static create(raw: CreateCommentProps): Result<Comment> {
    const validateResult = Comment.validateProps(raw);

    if (validateResult.isErr()) {
      return Err(validateResult.unwrapErr());
    }

    const comment = new Comment({
      ...raw,
      parentCommentId: raw.parentCommentId ?? null,
      deletedAt: raw.deletedAt ?? null,
      createdAt: raw.createdAt ?? new Date(),
      updatedAt: raw.updatedAt ?? new Date(),
    });

    if (!raw.id) {
      comment.apply(new CommentCreatedEvent(comment.toObject()));
    }

    return Ok(comment);
  }

  static validateProps(props: CreateCommentProps): Result<void> {
    if (!props.profileId) {
      return Err(new Error('Profile ID is required'));
    }

    if (!props.postId) {
      return Err(new Error('Post ID is required'));
    }

    if (!props.text || props.text.trim().length === 0) {
      return Err(new Error('Text is required'));
    }

    if (props.text.length > 500) {
      return Err(new Error('Text must be at most 500 characters'));
    }

    return Ok();
  }
}
