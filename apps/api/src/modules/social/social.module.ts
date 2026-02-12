import { Module } from '@nestjs/common';
import { PostRepositoryProvider } from './infra/providers/post-repository.provider';
import { CommentRepositoryProvider } from './infra/providers/comment-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { PostController } from './presentation/http/controllers/post.controller';
import { CommentController } from './presentation/http/controllers/comment.controller';
import { CreatePostHandler } from './application/commands/create-post';
import { DeletePostHandler } from './application/commands/delete-post';
import { CreateCommentHandler } from './application/commands/create-comment';
import { CommentCreatedEventHandler } from './application/events/comment-created.handler';
import { GetPostByIdHandler } from './application/queries/get-post-by-id';
import { ListPostCommentsHandler } from './application/queries/list-post-comments';
import { PostReadStoreProvider } from './infra/providers/post-read-store.provider';
import { CommentReadStoreProvider } from './infra/providers/comment-read-store.provider';
import { AccountModule } from '@modules/account/account.module';
import { MediaModule } from '@modules/media/media.module';

@Module({
  imports: [PrismaModule, AccountModule, MediaModule],
  providers: [
    PostRepositoryProvider,
    CommentRepositoryProvider,
    CreatePostHandler,
    DeletePostHandler,
    CreateCommentHandler,
    CommentCreatedEventHandler,
    PostReadStoreProvider,
    CommentReadStoreProvider,
    GetPostByIdHandler,
    ListPostCommentsHandler,
  ],
  exports: [
    PostRepositoryProvider,
    CommentRepositoryProvider,
    PostReadStoreProvider,
    CommentReadStoreProvider,
  ],
  controllers: [PostController, CommentController],
})
export class SocialModule {}
