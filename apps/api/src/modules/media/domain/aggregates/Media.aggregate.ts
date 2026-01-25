import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import { MediaType } from '../enums/media-type.enum';
import { MediaStatus } from '../enums/media-status.enum';

interface MediaProps {
  id: ID;
  key: string;
  type: MediaType;
  status: MediaStatus;
  size: number;
  purpose?: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateMediaProps = Omit<
  MediaProps,
  'id' | 'status' | 'createdAt' | 'updatedAt'
> & {
  id?: ID;
  status?: MediaStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Media extends Aggregate<MediaProps> {
  private constructor(props: MediaProps) {
    super(props);
  }

  markAsProcessing(): void {
    this.set('status', MediaStatus.PROCESSING);
    this.set('updatedAt', new Date());
  }

  markAsReady(newSize: number, newKey?: string): void {
    this.set('status', MediaStatus.READY);
    this.set('size', newSize);
    if (newKey) {
      this.set('key', newKey);
    }
    this.set('updatedAt', new Date());
  }

  markAsFailed(): void {
    this.set('status', MediaStatus.FAILED);
    this.set('updatedAt', new Date());
  }

  isReady(): boolean {
    return this.get('status') === MediaStatus.READY;
  }

  static create(raw: CreateMediaProps): Result<Media> {
    const error = Media.validateProps(raw);

    if (error) {
      return Err(error);
    }

    const now = new Date();

    const media = new Media({
      id: raw.id ?? ID.create().unwrap(),
      key: raw.key.trim(),
      type: raw.type,
      status: raw.status ?? MediaStatus.PENDING,
      size: raw.size,
      purpose: raw.purpose,
      createdAt: raw.createdAt ?? now,
      updatedAt: raw.updatedAt ?? now,
    });

    return Ok(media);
  }

  private static validateProps(props: CreateMediaProps): Error | null {
    if (!props.key) {
      return new Error('Media key is required');
    }

    if (!Object.values(MediaType).includes(props.type)) {
      return new Error('Invalid media type');
    }

    if (!Number.isFinite(props.size) || props.size <= 0) {
      return new Error('Media size must be greater than zero');
    }

    return null;
  }
}
