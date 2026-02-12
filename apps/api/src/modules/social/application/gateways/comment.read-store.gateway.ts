import { Result } from '@inpro/core';
import { CommentListItemReadModel } from '../read-models/comment-list-item.read-model';
import {
  CursorPaginated,
  CursorPagination,
} from '@shared/utils/cursor-pagination';

export abstract class CommentReadStore {
  abstract findByPostId(
    postId: string,
    pagination: CursorPagination,
    requestorProfileId: string,
  ): Promise<Result<CursorPaginated<CommentListItemReadModel>>>;
}
