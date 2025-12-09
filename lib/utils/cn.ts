/**
 * 클래스명을 조건부로 합치는 유틸리티 함수
 * @param classes 합칠 클래스명들
 * @returns 합쳐진 클래스명 문자열
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
