import { CreateCommentCommand } from '@modules/social/application/commands/create-comment';
import { ToggleCommentLikeCommand } from '@modules/social/application/commands/toggle-comment-like';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCommentDTO } from '../dtos/create-comment.dto';
import { CommentPresenter } from '../presenters/comment.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';
import { LikeToggleViewModel } from '../view-model/like-toggle.view-model';

@ApiTags('Comments')
@ApiBearerAuth()
@Controller('social/comments')
export class CommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a comment on a post' })
  @ApiBody({ type: CreateCommentDTO })
  @ApiResponse({ status: 201, description: 'Comment created' })
  async createComment(
    @Body() dto: CreateCommentDTO,
    @Principal() principal: IPrincipal,
  ) {
    const result = await this.commandBus.execute(
      new CreateCommentCommand(
        principal.profileId,
        dto.postId,
        dto.text,
        dto.mentions,
        dto.parentCommentId,
      ),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    const presenter = new CommentPresenter();

    return presenter.present(result.unwrap());
  }

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like on a comment' })
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiOkResponse({ description: 'Like toggled' })
  async toggleCommentLike(
    @Param('id') id: string,
    @Principal() principal: IPrincipal,
  ): Promise<LikeToggleViewModel> {
    const result = await this.commandBus.execute(
      new ToggleCommentLikeCommand(principal.profileId, id),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return result.unwrap();
  }
}
