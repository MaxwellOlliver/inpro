import { Err, ID, Ok, Result, ValueObject } from '@inpro/core';

interface MentionProps {
  mentionedProfileId: ID;
  startIndex: number;
  endIndex: number;
  surfaceText: string;
}

export class Mention extends ValueObject<MentionProps> {
  private constructor(props: MentionProps) {
    super(props);
  }

  static create(props: MentionProps): Result<Mention> {
    if (!props.mentionedProfileId) {
      return Err(new Error('Mentioned profile ID is required'));
    }

    if (props.startIndex < 0) {
      return Err(new Error('Start index must be >= 0'));
    }

    if (props.endIndex <= props.startIndex) {
      return Err(new Error('End index must be greater than start index'));
    }

    if (!props.surfaceText || !props.surfaceText.startsWith('@')) {
      return Err(new Error('Surface text must start with @'));
    }

    if (props.surfaceText.length > 100) {
      return Err(new Error('Surface text must be at most 100 characters'));
    }

    return Ok(new Mention(props));
  }
}
