import { Injectable } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { CommentCreatedEvent } from '@modules/social/domain/events/comment-created.event';

@Injectable()
@EventsHandler(CommentCreatedEvent)
export class CommentCreatedEventHandler
  implements IEventHandler<CommentCreatedEvent>
{
  async handle(event: CommentCreatedEvent) {
    const mentions = event.comment.get('mentions');
    // TODO: For each mention, create a notification using the notification module
    // The "profile-mentioned" notification template doesn't exist yet.
    // The flow skeleton is in place for when notifications are implemented.
    void mentions;
  }
}
