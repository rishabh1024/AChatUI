// Application constants
export const APP_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000,
  DEFAULT_TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  HEALTH_CHECK_INTERVAL: 30000,
} as const;

export const UI_CONSTANTS = {
  TEXTAREA_MIN_HEIGHT: 48,
  TEXTAREA_MAX_HEIGHT: 200,
  SIDEBAR_WIDTH: 256,
} as const;

export const API_ENDPOINTS = {
  CHAT: '/chat',
  HEALTH: '/health',
} as const;
