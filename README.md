# Dutch Bamin

Next.js 14+ App Router를 기반으로 한 TypeScript 보일러플레이트 프로젝트입니다.

## 기술 스택

- **Framework**: Next.js 16.0.8 (App Router)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Runtime**: Node.js 20+
- **Package Manager**: Bun / npm / yarn / pnpm

## 프로젝트 구조

```
dutch-bamin/
├── app/                    # Next.js App Router 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 메인 페이지
│   └── globals.css        # 전역 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # UI 컴포넌트 (Button, Input, Card 등)
│   └── layout/           # 레이아웃 컴포넌트 (Header, Footer)
├── hooks/                # 커스텀 React 훅
│   ├── useLocalStorage.ts
│   └── useDebounce.ts
├── lib/                  # 유틸리티 함수 및 헬퍼
│   ├── utils/           # 유틸리티 함수
│   ├── api/             # API 클라이언트
│   ├── constants.ts     # 전역 상수
│   └── env.ts           # 환경 변수
├── types/               # TypeScript 타입 정의
│   └── common.ts        # 공통 타입
└── public/              # 정적 파일
```

## 시작하기

### 설치

```bash
# 의존성 설치
bun install
# 또는
npm install
```

### 환경 변수 설정

`.env.example` 파일을 복사하여 `.env.local` 파일을 생성하세요:

```bash
cp .env.example .env.local
```

### 개발 서버 실행

```bash
bun dev
# 또는
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 주요 기능

### 🎨 완성된 페이지들

#### 인증
- ✅ **로그인** - JWT 토큰 기반 인증
- ✅ **회원가입** - 유효성 검사 포함

#### 메인 서비스
- ✅ **가게 목록** - 카테고리 필터링, 정렬
- ✅ **가게 상세** - 메뉴 조회, 공구방 생성
- ✅ **공구방** - 참가자 관리, 장바구니, 메뉴 추가/삭제
- ✅ **결제** - 자동 정산, 간편결제

### 💡 핵심 기능

- 🏪 **가게 탐색** - 카테고리별, 정렬 기능
- 👥 **공구방 시스템** - 실시간 참가자 관리
- 🛒 **장바구니** - 개인별 메뉴 관리
- 💰 **스마트 정산** - 메뉴별 / N분의 1 정산
- 💳 **간편 결제** - 다양한 결제 수단 지원

### 🎨 UI 컴포넌트

- **Button**: 다양한 variants와 sizes 지원
- **Input**: 라벨, 에러 메시지, 헬퍼 텍스트
- **Card**: Header, Title, Content, Footer 포함
- **Header**: 로그인 상태 표시, 네비게이션

### 🔧 커스텀 훅

- **useAuth**: 전역 인증 상태 관리
- **useLocalStorage**: 로컬 스토리지 관리
- **useDebounce**: 값 디바운싱

### 🛠 유틸리티 함수

- **formatCurrency**: 통화 형식 포맷팅
- **formatDate**: 날짜 형식 포맷팅
- **formatNumber**: 숫자 형식 포맷팅
- **cn**: 클래스명 조건부 병합

### 🌐 API 클라이언트

완전히 타입 안전한 API 클라이언트:

```typescript
import { baeminApi } from '@/lib/api/baemin-api';

// 로그인
const user = await baeminApi.login({ email, password });

// 가게 조회
const stores = await baeminApi.getStores({ category: '한식' });

// 공구방 생성
const room = await baeminApi.createRoom({ ... });
```

## 배민투게더 API 통합

이 프로젝트는 배민투게더 API와 통합되어 있습니다.

### API 기능

- ✅ 인증 (회원가입, 로그인)
- ✅ 가게 조회 및 메뉴 검색
- ✅ 공구방 생성 및 관리
- ✅ 장바구니 및 주문
- ✅ 정산 및 결제
- ✅ **CORS 프록시 구현** - 브라우저에서 안전하게 API 호출 가능

### CORS 문제 해결

Next.js API Routes를 사용한 서버사이드 프록시로 CORS 문제를 해결했습니다:

```
브라우저 → Next.js 프록시 (/api/baemin/*) → 배민투게더 API
```

**클라이언트 코드 수정 불필요** - 기존 코드 그대로 사용 가능합니다!

자세한 내용은 [CORS 프록시 가이드](./docs/CORS_PROXY.md)를 참조하세요.

### API 사용 예시

```typescript
import { baeminApi } from '@/lib/api/baemin-api';

// 로그인 (자동으로 프록시를 통해 호출됨)
const response = await baeminApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// 가게 조회
const stores = await baeminApi.getStores({
  category: '한식',
  sortBy: 'rating'
});

// 공구방 생성
const room = await baeminApi.createRoom({
  hostId: userId,
  storeId: storeId,
  storeName: '맛있는 치킨',
  deliveryFee: 3000,
  minimumOrderAmount: 15000
});
```

자세한 API 사용법은 [API 가이드](./docs/API_GUIDE.md)를 참조하세요.

### API 예시 페이지

`/examples` 페이지에서 실제 API 호출 예시를 확인할 수 있습니다:

```bash
bun dev
# http://localhost:3000/examples 접속
```

**이제 CORS 에러 없이 모든 API를 사용할 수 있습니다!**

## 📖 상세 문서

- **[페이지 가이드](./docs/PAGES_GUIDE.md)** - 모든 페이지 기능 설명
- **[API 사용 가이드](./docs/API_GUIDE.md)** - API 상세 사용법
- **[CORS 프록시 가이드](./docs/CORS_PROXY.md)** - CORS 해결 방법

## 🚀 페이지 플로우

```
메인 (/)
  → 회원가입 (/auth/signup)
  → 로그인 (/auth/login)
  → 가게 목록 (/stores)
  → 가게 상세 (/stores/[storeId])
  → 공구방 (/rooms/[roomId])
  → 결제 (/rooms/[roomId]/payment)
```

## 빌드 및 배포

### 프로덕션 빌드

```bash
bun run build
# 또는
npm run build
```

### 프로덕션 서버 실행

```bash
bun start
# 또는
npm start
```

## Learn More

Next.js에 대해 더 알아보려면 다음 리소스를 참고하세요:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js 기능 및 API 학습
- [Learn Next.js](https://nextjs.org/learn) - 인터랙티브 Next.js 튜토리얼

## 라이선스

MIT
