import { Module } from '@nestjs/common';
import { MailerSendModule } from './mailer-send/mail-sender.module';

@Module({
  imports: [MailerSendModule],
  exports: [MailerSendModule],
})
export class MailModule {}
