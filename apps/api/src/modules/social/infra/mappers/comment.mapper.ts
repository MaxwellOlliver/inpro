import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import {
  Comment as CommentModel,
  CommentMention as CommentMentionModel,
} from '@generated/prisma/client';
import { CommentFactory } from '../factories/comment.factory';
import { ID } from '@inpro/core';
import { Mention } from '@modules/social/domain/value-objects/mention.value-object';

type CommentModelWithMentions = CommentModel & {
  mentions?: CommentMentionModel[];
};

export class CommentMapper {
  static fromModelToDomain(model: CommentModelWithMentions): Comment {
    const mentions = (model.mentions ?? []).map((m) =>
      Mention.create({
        mentionedProfileId: ID.create(m.mentionedProfileId).unwrap(),
        startIndex: m.startIndex,
        endIndex: m.endIndex,
        surfaceText: m.surfaceText,
      }).unwrap(),
    );

    return CommentFactory.make({
      id: ID.create(model.id).unwrap(),
      profileId: ID.create(model.profileId).unwrap(),
      postId: ID.create(model.postId).unwrap(),
      parentCommentId: model.parentCommentId
        ? ID.create(model.parentCommentId).unwrap()
        : null,
      text: model.text,
      mentions,
      deletedAt: model.deletedAt,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }

  static fromDomainToModel(comment: Comment): CommentModel & {
    mentions: {
      mentionedProfileId: string;
      startIndex: number;
      endIndex: number;
      surfaceText: string;
    }[];
  } {
    const {
      id,
      profileId,
      postId,
      parentCommentId,
      text,
      mentions,
      deletedAt,
      createdAt,
      updatedAt,
    } = comment.toObject();

    return {
      id,
      profileId,
      postId,
      parentCommentId: parentCommentId ?? null,
      text,
      deletedAt: deletedAt ?? null,
      createdAt,
      updatedAt,
      mentions: mentions.map((m) => ({
        mentionedProfileId: m.mentionedProfileId,
        startIndex: m.startIndex,
        endIndex: m.endIndex,
        surfaceText: m.surfaceText,
      })),
    };
  }
}
