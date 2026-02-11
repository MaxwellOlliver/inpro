import { CreatePostCommand } from '@modules/social/application/commands/create-post';
import { DeletePostCommand } from '@modules/social/application/commands/delete-post';
import { GetPostByIdQuery } from '@modules/social/application/queries/get-post-by-id';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { PostPresenter } from '../presenters/post.presenter';
import { PostDetailPresenter } from '../presenters/post-detail.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { BusinessException } from '@shared/exceptions/business.exception';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('social/posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly profileRepository: ProfileRepository,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiOkResponse({ description: 'Post found' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getPostById(@Param('id') id: string) {
    const result = await this.queryBus.execute(new GetPostByIdQuery(id));

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new PostDetailPresenter();

    return presenter.present(result.unwrap());
  }

  @Post()
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBody({ type: CreatePostDTO })
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiNotFoundResponse({ description: 'Profile not found for user' })
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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiNoContentResponse({ description: 'Post deleted' })
  async deletePost(
    @Param('id') id: string,
    @Principal() principal: IPrincipal,
  ) {
    const result = await this.commandBus.execute(
      new DeletePostCommand(id, principal.userId),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }
  }
}
