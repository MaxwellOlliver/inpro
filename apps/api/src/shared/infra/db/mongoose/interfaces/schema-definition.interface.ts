import { Schema } from 'mongoose';

export interface SchemaDefinition {
  name: string;
  schema: Schema;
  discriminators?: SchemaDefinition[];
}
