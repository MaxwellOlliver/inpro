import { Provider } from '@nestjs/common';
import { PrismaCommentReadStore } from '../read-stores/prisma-comment.read-store';
import { CommentReadStore } from '@modules/social/application/gateways/comment.read-store.gateway';

export const CommentReadStoreProvider: Provider = {
  provide: CommentReadStore,
  useClass: PrismaCommentReadStore,
};
