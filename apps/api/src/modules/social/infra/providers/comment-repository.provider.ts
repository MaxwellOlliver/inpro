import { CommentRepository } from '@modules/social/domain/interfaces/repositories/comment.repository';
import { PrismaCommentRepository } from '../repositories/prisma-comment.repository';
import { Provider } from '@nestjs/common';

export const CommentRepositoryProvider: Provider = {
  provide: CommentRepository,
  useClass: PrismaCommentRepository,
};
