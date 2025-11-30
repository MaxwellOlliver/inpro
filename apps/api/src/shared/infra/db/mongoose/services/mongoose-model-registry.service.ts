import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { MongooseConnectionService } from './mongoose-connection.service';
import { SchemaDefinition } from '../interfaces/schema-definition.interface';

@Injectable()
export class MongooseModelRegistryService implements OnModuleInit {
  private static schemas: SchemaDefinition[] = [];
  private readonly logger = new Logger(MongooseModelRegistryService.name);

  constructor(private readonly connectionService: MongooseConnectionService) {}

  static registerSchemas(...schemas: SchemaDefinition[]) {
    this.schemas.push(...schemas);
  }

  onModuleInit() {
    const conn = this.connectionService.connection;

    for (const {
      name,
      schema,
      discriminators,
    } of MongooseModelRegistryService.schemas) {
      if (!conn.models[name]) {
        const model = conn.model(name, schema);

        if (discriminators) {
          for (const discriminator of discriminators) {
            model.discriminator(discriminator.name, discriminator.schema);
          }
        }
      }
    }

    this.logger.log(
      `Registered schemas: ${MongooseModelRegistryService.schemas
        .map((s) => s.name)
        .join(', ')}`,
    );
  }
}
