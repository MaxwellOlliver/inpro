import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const listPostCommentsSchema = z.object({
  cursor: z.string().uuid().optional(),
  take: z.coerce.number().int().min(1).max(50).default(10),
});

export class ListPostCommentsDTO extends createZodDto(listPostCommentsSchema) {}
