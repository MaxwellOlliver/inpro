import { CreatePostCommand } from '@modules/social/application/commands/create-post/create-post.command';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { PostPresenter } from '../presenters/post.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { ProfileRepository } from '@modules/profile/domain/interfaces/repositories/profile.repository';
import { BusinessException } from '@shared/exceptions/business.exception';

@Controller('social/posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly profileRepository: ProfileRepository,
  ) {}

  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDTO,
    @Principal() principal: IPrincipal,
  ) {
    const profileResult = await this.profileRepository.findByUserId(
      principal.userId,
    );

    if (profileResult.isErr()) {
      throw new BusinessException(
        'Profile not found for user',
        'PROFILE_NOT_FOUND',
        404,
      );
    }

    const profile = profileResult.unwrap();

    const post = await this.commandBus.execute(
      new CreatePostCommand(
        profile.toObject().id,
        createPostDto.text,
        createPostDto.visibility,
        createPostDto.mediaIds,
        createPostDto.parentId,
      ),
    );

    if (post.isErr()) {
      throw post.unwrapErr();
    }

    const presenter = new PostPresenter();

    return presenter.present(post.unwrap());
  }
}
