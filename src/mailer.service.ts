import { Resend } from 'resend';

export class MailerService {
  private readonly mailer: Resend;

  constructor() {
    this.mailer = new Resend(process.env.RESEND_API_KEY);
  }

  async SendCreationEmail({
    recipient,
    name,
  }: {
    recipient: string;
    name: string;
  }) {
    try {
      const data = await this.mailer.emails.send({
        from: 'Idc <onboarding@resend.dev>',
        to: [recipient],
        subject: 'Bienvenue chez Idc',
        html: `Bienvenue ${name} chez Idc Group`,
      });
      console.log({ data });
    } catch (error) {
      console.error(error);
    }
  }
}
