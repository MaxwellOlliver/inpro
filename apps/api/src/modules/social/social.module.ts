import { Module } from '@nestjs/common';
import { PostRepositoryProvider } from './infra/providers/post-repository.provider';
import { PrismaModule } from '@shared/infra/db/prisma/prisma.module';
import { PostController } from './presentation/http/controllers/post.controller';
import { CreatePostHandler } from './application/commands/create-post/create-post.handler';
import { ProfileModule } from '@modules/profile/profile.module';
import { MediaModule } from '@modules/media/media.module';

@Module({
  imports: [PrismaModule, ProfileModule, MediaModule],
  providers: [PostRepositoryProvider, CreatePostHandler],
  exports: [PostRepositoryProvider],
  controllers: [PostController],
})
export class SocialModule {}
