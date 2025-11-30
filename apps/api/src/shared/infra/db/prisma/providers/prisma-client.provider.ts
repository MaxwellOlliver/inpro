import { EnvService } from '@config/env/env.service';
import { PrismaClient } from '@generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { PRISMA_CLIENT } from '../tokens/prisma.tokens';
import { Provider } from '@nestjs/common';

export const PrismaClientProvider: Provider = {
  provide: PRISMA_CLIENT,
  useFactory: (env: EnvService) => {
    const adapter = new PrismaPg({
      connectionString: env.get('DATABASE_URL'),
    });
    const client = new PrismaClient({
      adapter,
      log: ['info', 'warn', 'error'],
    });

    return client;
  },
  inject: [EnvService],
};
