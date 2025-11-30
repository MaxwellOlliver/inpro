import { EnvService } from '@config/env/env.service';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { Mongoose, Connection } from 'mongoose';

@Injectable()
export class MongooseConnectionService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly mongoose = new Mongoose();
  private readonly logger = new Logger(MongooseConnectionService.name);

  constructor(private readonly env: EnvService) {}

  async onModuleInit() {
    await this.mongoose.connect(this.env.get('MONGO_URI'), {
      dbName: this.env.get('MONGO_DATABASE'),
    });

    this.logger.log('Connected to MongoDB');
  }

  async onModuleDestroy() {
    await this.mongoose.disconnect();
    this.logger.log('Disconnected from MongoDB');
  }

  get connection(): Connection {
    return this.mongoose.connection;
  }

  get models(): typeof this.mongoose.models {
    return this.mongoose.models;
  }
}
