import { createZodDto } from '@anatine/zod-nestjs';
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character',
      },
    ),
  userName: z.string().min(3).max(20),
  name: z.string().min(3).max(50),
  bio: z.string().min(3).max(255),
  location: z.string().min(3).max(50),
});

export class RegisterDTO extends createZodDto(registerSchema) {}
