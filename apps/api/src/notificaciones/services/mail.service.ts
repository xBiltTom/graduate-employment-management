import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  sendTransactionalEmail(input: {
    to: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<void> {
    const smtpHost = process.env.SMTP_HOST;

    if (!smtpHost) {
      this.logger.warn(
        `Email transaccional omitido por falta de SMTP_HOST para ${input.to}`,
      );
      return Promise.resolve();
    }

    this.logger.warn(
      `SMTP configurado para ${input.to}, pero el adaptador real de correo aun no esta implementado`,
    );
    return Promise.resolve();
  }
}
