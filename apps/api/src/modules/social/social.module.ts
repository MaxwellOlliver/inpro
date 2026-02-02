import { Module } from '@nestjs/common';
import { PostRepositoryProvider } from './infra/providers/post-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { PostController } from './presentation/http/controllers/post.controller';
import { CreatePostHandler } from './application/commands/create-post';
import { DeletePostHandler } from './application/commands/delete-post';
import { AccountModule } from '@modules/account/account.module';
import { MediaModule } from '@modules/media/media.module';

@Module({
  imports: [PrismaModule, AccountModule, MediaModule],
  providers: [PostRepositoryProvider, CreatePostHandler, DeletePostHandler],
  exports: [PostRepositoryProvider],
  controllers: [PostController],
})
export class SocialModule {}
