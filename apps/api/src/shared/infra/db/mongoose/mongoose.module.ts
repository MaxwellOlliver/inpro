import { DynamicModule, Module } from '@nestjs/common';
import { EnvService } from '@config/env/env.service';
import { MongooseConnectionService } from './services/mongoose-connection.service';
import { MongooseModelRegistryService } from './services/mongoose-model-registry.service';
import { SchemaDefinition } from './interfaces/schema-definition.interface';

@Module({})
export class MongooseModule {
  static register(...schemas: SchemaDefinition[]): DynamicModule {
    MongooseModelRegistryService.registerSchemas(...schemas);

    return {
      module: MongooseModule,
      providers: [
        EnvService,
        MongooseConnectionService,
        MongooseModelRegistryService,
      ],
      exports: [MongooseConnectionService],
    };
  }
}
