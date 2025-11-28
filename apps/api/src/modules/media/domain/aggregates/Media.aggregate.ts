import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import { MediaType } from '../enums/media-type.enum';

interface MediaProps {
  id: ID;
  url: string;
  type: MediaType;
  size: number;
  purpose?: string;
  createdAt: Date;
  updatedAt: Date;
}

type CreateMediaProps = Omit<MediaProps, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Media extends Aggregate<MediaProps> {
  private constructor(props: MediaProps) {
    super(props);
  }

  static create(raw: CreateMediaProps): Result<Media> {
    const error = Media.validateProps(raw);

    if (error) {
      return Err(error);
    }

    const now = new Date();

    const media = new Media({
      id: raw.id ?? ID.create().unwrap(),
      url: raw.url.trim(),
      type: raw.type,
      size: raw.size,
      purpose: raw.purpose,
      createdAt: raw.createdAt ?? now,
      updatedAt: raw.updatedAt ?? now,
    });

    return Ok(media);
  }

  private static validateProps(props: CreateMediaProps): Error | null {
    if (!props.url) {
      return new Error('Media url is required');
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
