import { Result } from '@inpro/core';

import { ID } from '@inpro/core';
import { Media } from '../aggregates/Media.aggregate';

export abstract class MediaRepository {
  abstract save(media: Media): Promise<Result<void>>;
  abstract findById(id: ID): Promise<Result<Media>>;
  abstract findByKey(key: string): Promise<Result<Media>>;
  abstract delete(id: ID): Promise<Result<void>>;
}
