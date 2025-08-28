import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  logger = new Logger(EmailService.name);
  constructor(private readonly MailService: MailerService) {}
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.MailService.sendMail({
        to: to,
        subject: subject,
        text: body,
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendVerificationMail(
    to: string,
    name: string,
    code: string,
  ): Promise<void> {
    try {
      await this.MailService.sendMail({
        to,
        subject: 'Welcome to Deven! Please verify your email',
        template: './verification',
        context: {
          name,
          code,
        },
      });
      this.logger.log(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
    }
  }

  async sendWelcomeMail(to: string, name: string): Promise<void> {
    try {
      await this.MailService.sendMail({
        to,
        subject: 'Welcome to the Deven community!',
        template: './welcome',
        context: {
          name,
        },
      });
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}`, error);
    }
  }

  async sendForgotPasswordMail(
    to: string,
    name: string,
    code: string,
  ): Promise<void> {
    try {
      await this.MailService.sendMail({
        to,
        subject: 'Deven Password Reset Request',
        template: './forgot-password',
        context: {
          name,
          code,
        },
      });
      this.logger.log(`Forgot password email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send forgot password email to ${to}`, error);
    }
  }
}
