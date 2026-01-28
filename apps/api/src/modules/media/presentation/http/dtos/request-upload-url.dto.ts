import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const requestUploadUrlSchema = z.object({
  filename: z.string().min(1).max(255),
  mimetype: z.string().min(1).max(100),
  size: z.number().int().positive(),
  purpose: z.string().min(1).max(50).default('post'),
});

export class RequestUploadUrlDTO extends createZodDto(requestUploadUrlSchema) {}
