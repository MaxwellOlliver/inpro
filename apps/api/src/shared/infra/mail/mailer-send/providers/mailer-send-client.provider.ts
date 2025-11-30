import { Provider } from '@nestjs/common';
import { MAILER_SEND_CLIENT } from '../tokens/mailer-send.tokens';
import { EnvService } from '@config/env/env.service';
import { MailerSend } from 'mailersend';

export const MailerSendClientProvider: Provider = {
  provide: MAILER_SEND_CLIENT,
  useFactory: (env: EnvService) => {
    return new MailerSend({
      apiKey: env.get('MAILERSEND_API_KEY'),
    });
  },
  inject: [EnvService],
};
