import { PostDetailReadModel } from '@modules/social/application/read-models/post-detail.read-model';
import { PostDetailViewModel } from '../view-model/post-detail.view-model';
import { CursorPaginated } from '@shared/utils/cursor-pagination';

export class PostListPresenter {
  present(
    data: CursorPaginated<PostDetailReadModel>,
  ): CursorPaginated<PostDetailViewModel> {
    return {
      data: data.data.map((post) => ({
        id: post.id,
        profileId: post.profileId,
        text: post.text,
        visibility: post.visibility,
        parentId: post.parentId,
        mediaIds: post.mediaIds,
        commentCount: post.commentCount,
        likeCount: post.likeCount,
        isLikedByMe: post.isLikedByMe,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      })),
      nextCursor: data.nextCursor,
    };
  }
}
