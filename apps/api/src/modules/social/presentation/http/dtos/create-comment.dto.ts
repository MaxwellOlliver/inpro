import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

const mentionSchema = z.object({
  mentionedProfileId: z.string().uuid(),
  startIndex: z.number().int().min(0),
  endIndex: z.number().int().min(1),
  surfaceText: z.string().min(1).max(100),
});

export const createCommentSchema = z.object({
  postId: z.string().uuid(),
  text: z.string().min(1).max(500),
  mentions: z.array(mentionSchema).max(20).default([]),
  parentCommentId: z.string().uuid().optional(),
});

export class CreateCommentDTO extends createZodDto(createCommentSchema) {}
