import { Inject, Injectable } from '@nestjs/common';
import {
  MailGateway,
  SendEmailParams,
} from '@shared/application/gateways/mail.gateway';
import { MAILER_SEND_CLIENT } from '../tokens/mailer-send.tokens';
import { EmailParams, Recipient, MailerSend, Sender } from 'mailersend';
import { Err, Ok, Result } from '@inpro/core';
import { APIResponse } from 'mailersend/lib/services/request.service';

@Injectable()
export class MailerSendMailService implements MailGateway {
  private readonly from: Sender;

  constructor(@Inject(MAILER_SEND_CLIENT) private readonly mailer: MailerSend) {
    this.from = new Sender('maxwell.silva@moondev.com.br', 'Inpro Test');
  }

  private parseError(error: APIResponse): Error {
    return new Error((error.body as { message: string }).message);
  }

  async sendEmail({ to, subject, text, options }: SendEmailParams) {
    let sender: Sender = this.from;

    if (options?.sender) {
      sender = new Sender(options.sender.email, options.sender.name);
    }

    const recipients = to.map(
      (recipient) => new Recipient(recipient.email, recipient.name),
    );

    const emailParams = new EmailParams()
      .setFrom(sender)
      .setReplyTo(sender)
      .setTo(recipients)
      .setSubject(subject)
      .setHtml(text);

    const result = await Result.fromPromise(
      this.mailer.email.send(emailParams),
    );

    if (result.isErr()) {
      return Err(this.parseError(result.getErr()! as unknown as APIResponse));
    }

    return Ok();
  }
}
