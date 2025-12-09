# CORS 프록시 설정 가이드

## 문제 상황

브라우저에서 외부 API를 직접 호출할 때 CORS (Cross-Origin Resource Sharing) 정책으로 인해 요청이 차단됩니다.

```
Access to fetch at 'http://35.216.1.9:8080/api/auth/login' from origin 'http://localhost:3000'
has been blocked by CORS policy
```

## 해결 방법

Next.js API Routes를 사용하여 서버사이드 프록시를 구현했습니다.

### 아키텍처

```
브라우저 (localhost:3000)
    ↓
Next.js API Route (/api/baemin/*)
    ↓
배민투게더 API (35.216.1.9:8080)
```

## 구현 내용

### 1. 프록시 API Route

**파일**: `app/api/baemin/[...path]/route.ts`

모든 HTTP 메서드(GET, POST, PUT, DELETE)를 지원하며, 다음과 같이 동작합니다:

1. 클라이언트에서 `/api/baemin/*` 경로로 요청
2. 서버에서 실제 API로 요청 전달
3. 응답을 클라이언트에 반환

### 2. 자동 경로 전환

**파일**: `lib/api/endpoints.ts`

```typescript
// 브라우저에서는 프록시 사용, 서버에서는 직접 호출
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/baemin'  // 클라이언트: Next.js API 프록시 사용
    : process.env.BAEMIN_API_URL || 'http://35.216.1.9:8080';  // 서버: 직접 호출
```

## 사용 방법

### 클라이언트에서 API 호출

기존 코드를 **수정할 필요 없이** 그대로 사용하면 됩니다:

```typescript
import { baeminApi } from '@/lib/api/baemin-api';

// 자동으로 프록시를 통해 호출됨
const response = await baeminApi.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### 실제 요청 경로

클라이언트 코드에서는 다음과 같이 호출됩니다:

```
baeminApi.login()
→ POST /api/baemin/auth/login (프록시)
→ POST http://35.216.1.9:8080/api/auth/login (실제 API)
```

## 장점

1. **CORS 문제 해결**: 서버사이드에서 API 호출
2. **보안 강화**: API 키나 민감한 정보를 서버에서만 사용 가능
3. **캐싱 가능**: Next.js에서 서버사이드 캐싱 구현 가능
4. **에러 처리**: 중앙화된 에러 처리 및 로깅
5. **투명성**: 클라이언트 코드 변경 불필요

## 환경 변수 설정

`.env.local` 파일:

```bash
# 서버사이드에서 사용할 실제 API URL
BAEMIN_API_URL=http://35.216.1.9:8080
```

## 프록시 커스터마이징

필요에 따라 프록시에 다음 기능을 추가할 수 있습니다:

### 1. 로깅

```typescript
async function proxyRequest(...) {
  console.log(`[Proxy] ${method} ${url}`);
  // ...
}
```

### 2. 요청/응답 변환

```typescript
// 요청 헤더 추가
headers['X-Custom-Header'] = 'value';

// 응답 데이터 변환
const transformedData = transformResponse(data);
return NextResponse.json(transformedData);
```

### 3. 캐싱

```typescript
export const revalidate = 60; // 60초 캐싱

export async function GET(request: NextRequest, ...) {
  // ...
}
```

### 4. Rate Limiting

```typescript
import { ratelimit } from '@/lib/ratelimit';

async function proxyRequest(...) {
  const { success } = await ratelimit.limit(request.ip);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }
  // ...
}
```

## 트러블슈팅

### 1. 프록시가 작동하지 않는 경우

개발 서버를 재시작하세요:

```bash
# 서버 종료 후 재시작
bun dev
```

### 2. 환경 변수가 반영되지 않는 경우

`.env.local` 파일이 있는지 확인하고, 서버를 재시작하세요.

### 3. 타임아웃 에러

프록시 요청에 타임아웃을 추가할 수 있습니다:

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000); // 10초

const response = await fetch(url, {
  signal: controller.signal,
  // ...
});

clearTimeout(timeoutId);
```

## 프로덕션 배포 시 주의사항

1. **환경 변수 설정**: Vercel, AWS 등에서 `BAEMIN_API_URL` 환경 변수 설정
2. **HTTPS 사용**: 프로덕션에서는 HTTPS API 사용 권장
3. **에러 로깅**: Sentry 등의 에러 추적 서비스 통합
4. **Rate Limiting**: API 남용 방지를 위한 제한 설정

## 참고 자료

- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [CORS 이해하기](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
- [Proxy Pattern](https://en.wikipedia.org/wiki/Proxy_pattern)
