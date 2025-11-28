import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import { MediaType } from '../enums/media-type.enum';
import z from 'zod';

interface MediaProps {
  id?: ID;
  url: string;
  type: MediaType;
  size: number;
  purpose: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Media extends Aggregate<MediaProps> {
  static readonly schema = z.object({
    id: z.optional(z.custom<ID>((value) => value instanceof ID)),
    url: z.string(),
    type: z.nativeEnum(MediaType),
    size: z.number(),
    purpose: z.string(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  });

  private constructor(props: MediaProps) {
    super(props);
  }

  static create(props: MediaProps): Result<Media> {
    if (!Media.isValidProps(props)) {
      return Err(new Error('Invalid media props'));
    }

    const media = new Media({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });

    return Ok(media);
  }

  static isValidProps(props: MediaProps) {
    return Media.schema.safeParse(props).success;
  }
}
