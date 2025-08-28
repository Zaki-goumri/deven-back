import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_JOBS } from 'src/common/constants/jobs';
import { QUEUE_NAME } from 'src/common/constants/queues';
import { EmailService } from 'src/email/email.service';
import { SendMailDto } from './dtos/send-mail.dto';
import { Logger } from '@nestjs/common';
import { SendVerificationMailDto } from './dtos/send-verification-mail.dto';
import { SendWelcomeEmailDto } from './dtos/send-welcome-email.dto';
import { SendForgotPasswordEmailDto } from './dtos/send-forgot-password-email.dto';

@Processor(QUEUE_NAME.MAIL)
export class MailProcessor extends WorkerHost {
  logger = new Logger(MailProcessor.name);
  constructor(private readonly mailService: EmailService) {
    super();
  }
  process(job: Job): Promise<any> {
    switch (job.name) {
      case MAIL_JOBS.SEND_MAIL:
        this.logger.log('Processing Sending mail job');
        return this.handleSendMailJob(job as Job<SendMailDto>);
      case MAIL_JOBS.SEND_VERIFICATION_MAIL:
        this.logger.log('Processing sending verification mail job');
        return this.handleSendVerificationMailJob(
          job as Job<SendVerificationMailDto>,
        );
      case MAIL_JOBS.SEND_WELCOME_MAIL:
        this.logger.log('Processing sending welcome mail job');
        return this.handleSendWelcomeMailJob(job as Job<SendWelcomeEmailDto>);
      case MAIL_JOBS.SEND_RESET_PASSWORD_MAIL:
        this.logger.log('Processing sending forgot password mail job');
        return this.handleSendForgotPasswordMailJob(
          job as Job<SendForgotPasswordEmailDto>,
        );
      default:
        return Promise.resolve();
    }
  }
  handleSendMailJob(job: Job<SendMailDto>): Promise<void> {
    const { to, subject, body } = job.data;
    return this.mailService.sendEmail(to, subject, body);
  }

  handleSendVerificationMailJob(
    job: Job<SendVerificationMailDto>,
  ): Promise<void> {
    const { to, name, code } = job.data;
    return this.mailService.sendVerificationMail(to, name, code);
  }

  handleSendWelcomeMailJob(job: Job<SendWelcomeEmailDto>): Promise<void> {
    const { email, name } = job.data;
    return this.mailService.sendWelcomeMail(email, name);
  }

  handleSendForgotPasswordMailJob(
    job: Job<SendForgotPasswordEmailDto>,
  ): Promise<void> {
    const { email, name, code } = job.data;
    return this.mailService.sendForgotPasswordMail(email, name, code);
  }
}
