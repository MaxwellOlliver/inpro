import { Result } from '@inpro/core';

import { ID } from '@inpro/core';
import { Media } from '../aggregates/Media.aggregate';

export interface IMediaRepository {
  save(media: Media): Promise<Result<Media>>;
  findById(id: ID): Promise<Result<Media>>;
  findByUrl(url: string): Promise<Result<Media>>;
  delete(id: ID): Promise<Result<void>>;
}
