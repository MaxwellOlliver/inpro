import { Post } from '@modules/social/domain/aggregates/post.aggregate';
import { PostViewModel } from '../view-model/post.view-model';

export class PostPresenter {
  present(post: Post): PostViewModel {
    const {
      id,
      profileId,
      text,
      visibility,
      parentId,
      mediaIds,
      createdAt,
      updatedAt,
    } = post.toObject();

    return {
      id,
      profileId,
      text,
      visibility,
      parentId,
      mediaIds,
      createdAt,
      updatedAt,
    };
  }
}
