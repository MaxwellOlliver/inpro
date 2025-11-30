import { Result } from '@inpro/core';

interface RecipientProps {
  email: string;
  name?: string;
}

interface SenderProps {
  email: string;
  name?: string;
}

interface SendEmailOptions {
  sender?: SenderProps;
}

export interface SendEmailParams {
  to: [RecipientProps, ...RecipientProps[]];
  subject: string;
  text: string;
  options?: SendEmailOptions;
}

export abstract class MailGateway {
  abstract sendEmail(params: SendEmailParams): Promise<Result<void, Error>>;
}
