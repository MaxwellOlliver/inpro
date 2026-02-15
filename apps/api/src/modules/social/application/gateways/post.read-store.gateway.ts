import { Result } from '@inpro/core';
import { PostDetailReadModel } from '../read-models/post-detail.read-model';
import {
  CursorPaginated,
  CursorPagination,
} from '@shared/utils/cursor-pagination';

export abstract class PostReadStore {
  abstract findById(
    id: string,
    requestorProfileId: string,
  ): Promise<Result<PostDetailReadModel>>;

  abstract findAll(
    pagination: CursorPagination,
    requestorProfileId: string,
  ): Promise<Result<CursorPaginated<PostDetailReadModel>>>;
}
