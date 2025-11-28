import { Result } from '@inpro/core';
import { Media } from '@modules/media/domain/aggregates/Media.aggregate';

export type CreateMediaInputDTO = {
  file: Express.Multer.File;
  purpose: string;
};

export type CreateMediaOutputDTO = Result<Media>;
