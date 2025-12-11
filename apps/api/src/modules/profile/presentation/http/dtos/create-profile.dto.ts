import { createZodDto } from '@anatine/zod-nestjs';
import z from 'zod';

export const createProfileSchema = z.object({
  userName: z.string().min(3).max(20),
  name: z.string().min(3).max(50),
  bio: z.string().min(3).max(255),
  location: z.string().min(3).max(50),
});

export class CreateProfileDTO extends createZodDto(createProfileSchema) {}
