import { Result } from '@inpro/core';

export interface LikeToggleResult {
  liked: boolean;
  likeCount: number;
}

export abstract class LikeStore {
  abstract togglePostLike(
    profileId: string,
    postId: string,
  ): Promise<Result<LikeToggleResult>>;

  abstract toggleCommentLike(
    profileId: string,
    commentId: string,
  ): Promise<Result<LikeToggleResult>>;
}
