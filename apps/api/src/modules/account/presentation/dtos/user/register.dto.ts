import { createZodDto } from '@anatine/zod-nestjs';
import { registerSchema } from '../../schemas/user/register.schema';

export class RegisterDTO extends createZodDto(registerSchema) {}
