import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const listActivitySchema = z.object({
  cursor: z.string().optional(),
  take: z.coerce.number().int().min(1).max(50).default(10),
});

export class ListActivityDTO extends createZodDto(listActivitySchema) {}
