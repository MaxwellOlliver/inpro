import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';
import { PostVisibility } from '@modules/social/domain/enums/post-visibility.enum';

export const createPostSchema = z.object({
  text: z.string().min(1).max(255),
  visibility: z.nativeEnum(PostVisibility).default(PostVisibility.PUBLIC),
  mediaIds: z.array(z.string().uuid()).max(4).optional(),
  parentId: z.string().uuid().optional(),
});

export class CreatePostDTO extends createZodDto(createPostSchema) {}
