import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export interface PostViewModel {
  id: string;
  profileId: string;
  text: string;
  visibility: PostVisibility;
  parentId?: string | null;
  mediaIds: string[];
  createdAt: Date;
  updatedAt: Date;
}
