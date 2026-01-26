import { Aggregate, Err, ID, Ok, Result } from '@inpro/core';
import { PostVisibility } from '../enums/post-visibility.enum';

interface PostProps {
  id?: ID;
  profileId: ID;
  text: string;
  visibility: PostVisibility;
  parentId?: ID | null;
  mediaIds: ID[];
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

type CreatePostProps = Omit<PostProps, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: ID;
  createdAt?: Date;
  updatedAt?: Date;
};

export class Post extends Aggregate<PostProps> {
  private constructor(props: PostProps) {
    super(props);
  }

  softDelete(): void {
    this.set('deletedAt', new Date());
    this.set('updatedAt', new Date());
  }

  static create(raw: CreatePostProps): Result<Post> {
    const validateResult = Post.validateProps(raw);

    if (validateResult.isErr()) {
      return Err(validateResult.unwrapErr());
    }

    const post = new Post({
      ...raw,
      parentId: raw.parentId ?? null,
      deletedAt: raw.deletedAt ?? null,
      createdAt: raw.createdAt ?? new Date(),
      updatedAt: raw.updatedAt ?? new Date(),
    });

    return Ok(post);
  }

  static validateProps(props: CreatePostProps): Result<void> {
    if (!props.profileId) {
      return Err(new Error('Profile ID is required'));
    }

    if (!props.text || props.text.trim().length === 0) {
      return Err(new Error('Text is required'));
    }

    if (props.text.length > 255) {
      return Err(new Error('Text must be less than 255 characters'));
    }

    if (props.mediaIds && props.mediaIds.length > 4) {
      return Err(new Error('Maximum 4 media items allowed'));
    }

    if (!Object.values(PostVisibility).includes(props.visibility)) {
      return Err(new Error('Invalid visibility value'));
    }

    return Ok();
  }
}
