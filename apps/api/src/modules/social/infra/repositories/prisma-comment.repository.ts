import { Err, Ok, Result } from '@inpro/core';
import { Comment } from '@modules/social/domain/aggregates/comment.aggregate';
import { CommentRepository } from '@modules/social/domain/interfaces/repositories/comment.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_CLIENT } from '@shared/infra/db/prisma/tokens/prisma.tokens';
import { CommentMapper } from '../mappers/comment.mapper';
import { PrismaClient } from '@generated/prisma/client';

@Injectable()
export class PrismaCommentRepository implements CommentRepository {
  constructor(@Inject(PRISMA_CLIENT) private readonly prisma: PrismaClient) {}

  async save(comment: Comment): Promise<Result<Comment>> {
    const model = CommentMapper.fromDomainToModel(comment);
    const { mentions, ...commentData } = model;

    const result = await Result.fromPromise(
      this.prisma.$transaction(async (tx) => {
        const savedComment = await tx.comment.upsert({
          where: { id: commentData.id },
          update: commentData,
          create: commentData,
        });

        await tx.commentMention.deleteMany({
          where: { commentId: savedComment.id },
        });

        if (mentions.length > 0) {
          await tx.commentMention.createMany({
            data: mentions.map((mention) => ({
              commentId: savedComment.id,
              mentionedProfileId: mention.mentionedProfileId,
              startIndex: mention.startIndex,
              endIndex: mention.endIndex,
              surfaceText: mention.surfaceText,
            })),
          });
        }

        return tx.comment.findUnique({
          where: { id: savedComment.id },
          include: { mentions: true },
        });
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const savedComment = result.unwrap();
    if (!savedComment) {
      return Err(new Error('Failed to save comment'));
    }

    return Ok(CommentMapper.fromModelToDomain(savedComment));
  }

  async findById(id: string): Promise<Result<Comment>> {
    const result = await Result.fromPromise(
      this.prisma.comment.findUnique({
        where: { id },
        include: { mentions: true },
      }),
    );

    if (result.isErr()) {
      return Err(result.getErr()!);
    }

    const comment = result.unwrap();

    if (!comment) {
      return Err(new Error('Comment not found'));
    }

    return Ok(CommentMapper.fromModelToDomain(comment));
  }
}
