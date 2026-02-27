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
      media: readModel.media,
      commentCount: readModel.commentCount,
      likeCount: readModel.likeCount,
      isLikedByMe: readModel.isLikedByMe,
      hasReplies: readModel.hasReplies,
      createdAt: readModel.createdAt,
      updatedAt: readModel.updatedAt,
      author: readModel.author,
    };
  }
}
