import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const updateProfileSchema = z
  .object({
    userName: z.string().min(3).max(20).optional(),
    name: z.string().min(3).max(50).optional(),
    bio: z.string().min(3).max(255).optional(),
    location: z.string().min(3).max(50).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required',
  });

export class UpdateProfileDTO extends createZodDto(updateProfileSchema) {}
