/**
 * 애플리케이션 전역 상수
 */

export const APP_NAME = 'Dutch Bamin';
export const APP_DESCRIPTION = 'Dutch Bamin - 배달 공동구매 플랫폼';

/**
 * 배민투게더 API Base URL
 */
export const BAEMIN_API_URL = 'http://35.216.1.9:8080';

/**
 * 로컬 스토리지 키
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  LANGUAGE: 'language',
} as const;

/**
 * 경로 상수
 */
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
} as const;

/**
 * 테마 상수
 */
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
} as const;
