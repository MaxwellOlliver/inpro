import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@generated/prisma/client';
import { EnvService } from '@config/env/env.service';

@Injectable()
export class PrismaGateway implements OnModuleInit {
  private readonly adapter: PrismaPg;
  readonly client: PrismaClient;

  constructor(envService: EnvService) {
    this.adapter = new PrismaPg({
      connectionString: envService.get('DATABASE_URL'),
    });
    this.client = new PrismaClient({
      adapter: this.adapter,
      log: ['info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    await this.client.$connect();
  }
}
