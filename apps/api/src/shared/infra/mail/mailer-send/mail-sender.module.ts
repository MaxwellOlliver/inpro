import { MailerSendClientProvider } from './providers/mailer-send-client.provider';
import { MailerSendMailService } from './services/mailer-send-mail.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [MailerSendMailService, MailerSendClientProvider],
  exports: [MailerSendMailService, MailerSendClientProvider],
})
export class MailerSendModule {}
