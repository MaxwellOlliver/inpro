import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const listPostsSchema = z.object({
  cursor: z.string().uuid().optional(),
  take: z.coerce.number().int().min(1).max(50).default(10),
});

export class ListPostsDTO extends createZodDto(listPostsSchema) {}
