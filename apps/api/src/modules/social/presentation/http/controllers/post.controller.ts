import { CreatePostCommand } from '@modules/social/application/commands/create-post';
import { DeletePostCommand } from '@modules/social/application/commands/delete-post';
import { TogglePostLikeCommand } from '@modules/social/application/commands/toggle-post-like';
import { GetPostByIdQuery } from '@modules/social/application/queries/get-post-by-id';
import { ListPostCommentsQuery } from '@modules/social/application/queries/list-post-comments';
import { ListPostsQuery } from '@modules/social/application/queries/list-posts';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
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
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePostDTO } from '../dtos/create-post.dto';
import { ListPostCommentsDTO } from '../dtos/list-post-comments.dto';
import { ListPostsDTO } from '../dtos/list-posts.dto';
import { PostPresenter } from '../presenters/post.presenter';
import { PostDetailPresenter } from '../presenters/post-detail.presenter';
import { PostListPresenter } from '../presenters/post-list.presenter';
import { CommentListPresenter } from '../presenters/comment-list.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { ProfileRepository } from '@modules/account/domain/interfaces/repositories/profile.repository';
import { BusinessException } from '@shared/exceptions/business.exception';
import { LikeToggleViewModel } from '../view-model/like-toggle.view-model';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('social/posts')
export class PostController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly profileRepository: ProfileRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List posts (most recent first)' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (post ID)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of posts to return (1-50, default 10)',
  })
  @ApiOkResponse({ description: 'Posts list' })
  async listPosts(
    @Query() query: ListPostsDTO,
    @Principal() principal: IPrincipal,
  ) {
    const result = await this.queryBus.execute(
      new ListPostsQuery(principal.profileId, query.cursor, query.take),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new PostListPresenter();

    return presenter.present(result.unwrap());
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiOkResponse({ description: 'Post found' })
  @ApiNotFoundResponse({ description: 'Post not found' })
  async getPostById(
    @Param('id') id: string,
    @Principal() principal: IPrincipal,
  ) {
    const result = await this.queryBus.execute(
      new GetPostByIdQuery(id, principal.profileId),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new PostDetailPresenter();

    return presenter.present(result.unwrap());
  }

  @Get(':id/comments')
  @ApiOperation({ summary: 'List comments for a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: 'Cursor for pagination (comment ID)',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    description: 'Number of comments to return (1-50, default 10)',
  })
  @ApiOkResponse({ description: 'Comments list' })
  async listPostComments(
    @Param('id') id: string,
    @Query() query: ListPostCommentsDTO,
    @Principal() principal: IPrincipal,
  ) {
    const result = await this.queryBus.execute(
      new ListPostCommentsQuery(
        id,
        principal.profileId,
        query.cursor,
        query.take,
      ),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new CommentListPresenter();

    return presenter.present(result.unwrap());
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a post' })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiOkResponse({ description: 'Like toggled' })
  async togglePostLike(
    @Param('id') id: string,
    @Principal() principal: IPrincipal,
  ): Promise<LikeToggleViewModel> {
    const result = await this.commandBus.execute(
      new TogglePostLikeCommand(principal.profileId, id),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return result.unwrap();
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
