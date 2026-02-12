import { PostDetailReadModel } from '@modules/social/application/read-models/post-detail.read-model';
import { PostDetailViewModel } from '../view-model/post-detail.view-model';

export class PostDetailPresenter {
  present(readModel: PostDetailReadModel): PostDetailViewModel {
    return {
      id: readModel.id,
      profileId: readModel.profileId,
      text: readModel.text,
      visibility: readModel.visibility,
      parentId: readModel.parentId,
      mediaIds: readModel.mediaIds,
      commentCount: readModel.commentCount,
      likeCount: readModel.likeCount,
      isLikedByMe: readModel.isLikedByMe,
      createdAt: readModel.createdAt,
      updatedAt: readModel.updatedAt,
    };
  }
}
