import { Body, Controller, Param, Post, Sse } from '@nestjs/common';
import { Public } from '@shared/infra/security/jwt/decorators/public.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { RequestUploadUrlDTO } from '../dtos/request-upload-url.dto';
import { RequestUploadUrlCommand } from '@modules/media/application/commands/request-upload-url/request-upload-url.command';
import { MediaStatusSseService } from '@modules/media/infra/sse/media-status.sse';
import { Observable, map } from 'rxjs';

interface MessageEvent {
  data: string | object;
}

@Controller('media')
export class MediaController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly mediaStatusSse: MediaStatusSseService,
  ) {}

  @Post('upload-url')
  async requestUploadUrl(@Body() dto: RequestUploadUrlDTO) {
    const result = await this.commandBus.execute(
      new RequestUploadUrlCommand(
        dto.filename,
        dto.mimetype,
        dto.size,
        dto.purpose,
      ),
    );

    if (result.isErr()) {
      throw result.unwrapErr();
    }

    return result.unwrap();
  }

  @Public()
  @Sse(':id/status')
  subscribeToStatus(@Param('id') mediaId: string): Observable<MessageEvent> {
    return this.mediaStatusSse.subscribe(mediaId).pipe(
      map((event) => ({
        data: event,
      })),
    );
  }
}
