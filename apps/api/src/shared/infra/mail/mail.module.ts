import { Module } from '@nestjs/common';
import { MailerSendModule } from './mailer-send/mail-sender.module';
import { MailGateway } from '@shared/application/gateways/mail.gateway';
import { MAILER_SEND_CLIENT } from './mailer-send/tokens/mailer-send.tokens';

@Module({
  imports: [MailerSendModule],
  providers: [
    {
      provide: MailGateway,
      useExisting: MAILER_SEND_CLIENT,
    },
  ],
  exports: [MailerSendModule, MailGateway],
})
export class MailModule {}
