export const SEARACH_JOB_NAME = {
  SEARCH: 'search',
  SEARCH_INDEX: 'search_index',
  SEARCH_DELETE: 'search_delete',
  SEARCH_UPDATE: 'search_update',
  SEARCH_REINDEX: 'search_reindex',
  SEARCH_REBUILD: 'search_rebuild',
  SEARCH_SYNC: 'search_sync',
  SEARCH_SYNC_ALL: 'search_sync_all',
  SEARCH_SYNC_INDEX: 'search_sync_index',
  SEARCH_SYNC_DELETE: 'search_sync_delete',
  SEARCH_SYNC_UPDATE: 'search_sync_update',
} as const;
export const MAIL_JOBS = {
  SEND_MAIL: 'send_mail',
  SEND_VERIFICATION_MAIL: 'send_verification_mail',
  SEND_RESET_PASSWORD_MAIL: 'send_reset_password_mail',
  SEND_WELCOME_MAIL: 'send_welcome_mail',
  SEND_NOTIFICATION_MAIL: 'send_notification_mail',
} as const;
export const ATTACHMENTS_JOBs = {
  UPLOAD_FILE: 'upload_file',
  DELETE_FILE: 'delete_file',
} as const;
