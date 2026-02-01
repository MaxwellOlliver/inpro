import { Err, Ok, Result, ValueObject } from '@inpro/core';

interface Props {
  sid: string;
  sub: string;
  profileId: string;
  email: string;
  deviceId: string;
  jti: string;
}

export class TokenPayload extends ValueObject<Props> {
  private constructor(props: Props) {
    super(props);
  }

  static create(props: Props): Result<TokenPayload, Error> {
    const isValid = this.isValidProps(props);

    if (!isValid) {
      return Err(new Error('Invalid token payload'));
    }

    return Ok(new TokenPayload(props));
  }

  static isValidProps(props: Props): boolean {
    if (
      !props.sid ||
      !props.sub ||
      !props.profileId ||
      !props.email ||
      !props.deviceId ||
      !props.jti
    ) {
      return false;
    }

    return true;
  }
}
