/**
 * 숫자를 통화 형식으로 포맷팅
 * @param amount 금액
 * @param currency 통화 코드 (기본값: 'KRW')
 * @returns 포맷된 통화 문자열
 */
export function formatCurrency(amount: number, currency: string = 'KRW'): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * 날짜를 지정된 형식으로 포맷팅
 * @param date 날짜 객체 또는 문자열
 * @param format 포맷 옵션
 * @returns 포맷된 날짜 문자열
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'full' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const options: Record<string, Intl.DateTimeFormatOptions> = {
    short: { year: 'numeric', month: '2-digit', day: '2-digit' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    full: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    },
  };

  return new Intl.DateTimeFormat('ko-KR', options[format]).format(dateObj);
}

/**
 * 숫자를 천 단위 구분 기호로 포맷팅
 * @param num 숫자
 * @returns 포맷된 숫자 문자열
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ko-KR').format(num);
}
