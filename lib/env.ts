/**
 * 환경 변수 타입 안전성을 위한 헬퍼
 */

export const env = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'Dutch Bamin',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
} as const;

/**
 * 환경 변수 유효성 검사
 */
export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_APP_NAME',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `경고: 다음 환경 변수가 설정되지 않았습니다: ${missing.join(', ')}`
    );
  }
}
