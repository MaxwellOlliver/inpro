import { PostRepository } from '@modules/social/domain/interfaces/repositories/post.repository';
import { PrismaPostRepository } from '../repositories/prisma-post.repository';
import { Provider } from '@nestjs/common';

export const PostRepositoryProvider: Provider = {
  provide: PostRepository,
  useClass: PrismaPostRepository,
};
