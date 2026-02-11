import { ID } from '@inpro/core';
import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import { Mention } from '@modules/social/domain/value-objects/mention.value-object';

interface CommentFactoryProps {
  id: ID;
  profileId: ID;
  postId: ID;
  parentCommentId: ID | null;
  text: string;
  mentions: Mention[];
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class CommentFactory {
  static make(data: CommentFactoryProps): Comment {
    return Comment.create({
      id: data.id,
      profileId: data.profileId,
      postId: data.postId,
      parentCommentId: data.parentCommentId,
      text: data.text,
      mentions: data.mentions,
      deletedAt: data.deletedAt,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }).unwrap();
  }
}
