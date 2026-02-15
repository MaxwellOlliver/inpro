import { Injectable } from '@nestjs/common';
import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommentCreatedEvent } from '@modules/social/domain/events/comment-created.event';

@Injectable()
@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler
  implements IEventHandler<CommentCreatedEvent>
{
  constructor(private readonly commandBus: CommandBus) {}

  handle() {
    // const mentions = event.comment.mentions;
    // mentions.forEach((mention) =>
    //   this.commandBus.execute(
    //     new SendNotificationCommand({
    //       channel: NotificationChannel.EMAIL,
    //       channelData: {},
    //       templateId: '',
    //       templateVariables: {},
    //       userId: mention.mentionedProfileId,
    //     }),
    //   ),
    // );
  }
}
