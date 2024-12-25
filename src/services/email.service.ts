import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';

import { emailConfigs } from '@/constants/email.constant';

export default class EmailService {
  replacedEmailTemplate(
    template: string,
    replaceValues: Record<string, string>[],
  ) {
    return replaceValues.reduce(
      (acc, replaceValue) => acc.replace(replaceValue.key, replaceValue.value),
      template,
    );
  }

  initTransporter() {
    return nodemailer.createTransport({
      host: emailConfigs.host,
      port: emailConfigs.port,
      auth: emailConfigs.auth,
      secure: true,
    });
  }

  sendMail(
    to: string,
    subject: string,
    emailTemplate: string,
  ): Promise<nodemailer.SentMessageInfo> {
    const name = 'Dev Blog';
    const mailOptions: Mail.Options = {
      from: {
        name,
        address: process.env.EMAIL_SERVICE_AUTH_USER!,
      },
      to,
      subject: subject,
      html: emailTemplate,
    };

    return this.initTransporter().sendMail(mailOptions);
  }
}
