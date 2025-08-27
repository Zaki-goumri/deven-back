export const QUEUE_NAME = {
  MAIL: 'mail',
  SEARCH: 'search',
} as const;

export const MAIL_JOBS = {
  SEND_MAIL: 'send-mail',
  SEND_VERIFICATION_MAIL: 'send-verification-mail',
  SEND_WELCOME_MAIL: 'send-welcome-mail',
  SEND_FORGOT_PASSWORD_MAIL: 'send-forgot-password-mail',
} as const;
