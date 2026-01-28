import { Injectable } from '@nestjs/common';
import { Subject, Observable, filter } from 'rxjs';
import { MediaStatus } from '@modules/media/domain/enums/media-status.enum';

export interface MediaStatusEvent {
  mediaId: string;
  status: MediaStatus;
  size?: number;
  error?: string;
}

@Injectable()
export class MediaStatusSseService {
  private readonly statusSubject = new Subject<MediaStatusEvent>();

  emit(event: MediaStatusEvent): void {
    this.statusSubject.next(event);
  }

  subscribe(mediaId: string): Observable<MediaStatusEvent> {
    return this.statusSubject
      .asObservable()
      .pipe(filter((event) => event.mediaId === mediaId));
  }
}
