import { Module } from '@nestjs/common';
import { PostRepositoryProvider } from './infra/providers/post-repository.provider';
import { CommentRepositoryProvider } from './infra/providers/comment-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { PostController } from './presentation/http/controllers/post.controller';
import { CommentController } from './presentation/http/controllers/comment.controller';
import { CreatePostHandler } from './application/commands/create-post';
import { DeletePostHandler } from './application/commands/delete-post';
import { CreateCommentHandler } from './application/commands/create-comment';
import { DeleteCommentHandler } from './application/commands/delete-comment';
import { TogglePostLikeHandler } from './application/commands/toggle-post-like';
import { ToggleCommentLikeHandler } from './application/commands/toggle-comment-like';
import { CommentCreatedEventHandler } from './application/events/comment-created.handler';
import { GetPostByIdHandler } from './application/queries/get-post-by-id';
import { ListPostCommentsHandler } from './application/queries/list-post-comments';
import { ListPostsHandler } from './application/queries/list-posts';
import { PostReadStoreProvider } from './infra/providers/post-read-store.provider';
import { CommentReadStoreProvider } from './infra/providers/comment-read-store.provider';
import { LikeStoreProvider } from './infra/providers/like-store.provider';
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
    DeleteCommentHandler,
    TogglePostLikeHandler,
    ToggleCommentLikeHandler,
    CommentCreatedEventHandler,
    PostReadStoreProvider,
    CommentReadStoreProvider,
    LikeStoreProvider,
    GetPostByIdHandler,
    ListPostCommentsHandler,
    ListPostsHandler,
  ],
  exports: [
    PostRepositoryProvider,
    CommentRepositoryProvider,
    PostReadStoreProvider,
    CommentReadStoreProvider,
    LikeStoreProvider,
  ],
  controllers: [PostController, CommentController],
})
export class SocialModule {}
