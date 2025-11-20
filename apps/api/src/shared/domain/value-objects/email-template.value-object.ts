import { Err, Ok, ValueObject } from '@inpro/core';
import { z } from 'zod';

interface Props {
  value: string;
}

export class EmailTemplate extends ValueObject<Props> {
  static readonly schema = z.string().email();

  constructor(props: Props) {
    super(props);
  }

  static create(value: string) {
    if (!this.isValid(value)) {
      return Err(new Error('Invalid email'));
    }

    return Ok(new EmailTemplate({ value }));
  }

  private static isValid(email: string): boolean {
    return this.schema.safeParse(email).success;
  }
}
