import { CreateCommentCommand } from '@modules/social/application/commands/create-comment';
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateCommentDTO } from '../dtos/create-comment.dto';
import { CommentPresenter } from '../presenters/comment.presenter';
import { Principal } from '@shared/infra/security/jwt/decorators/principal.decorator';
import { IPrincipal } from 'src/types/principal';

@Controller('social/comments')
export class CommentController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
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
}
