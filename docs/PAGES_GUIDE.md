# 페이지 가이드

## 전체 페이지 구조

### 인증 페이지

#### 1. 메인 페이지 (`/`)
- 서비스 소개 및 주요 기능 안내
- 로그인/회원가입 버튼
- 로그인 시 자동으로 `/stores`로 리다이렉트

#### 2. 로그인 (`/auth/login`)
- 이메일/비밀번호 로그인
- JWT 토큰 기반 인증
- 로그인 성공 시 `/stores`로 이동

#### 3. 회원가입 (`/auth/signup`)
- 필수 정보: 이메일, 비밀번호, 닉네임, 전화번호, 주소
- 비밀번호 유효성 검사 (8자 이상, 영문+숫자)
- 전화번호 형식 검사 (010-1234-5678)

### 메인 서비스 페이지

#### 4. 가게 목록 (`/stores`)
**기능:**
- 전체 가게 목록 조회
- 카테고리 필터링 (한식, 중식, 일식, 양식, 치킨, 피자, 분식, 카페)
- 정렬 (평점순, 리뷰많은순, 배달비낮은순)
- 가게 카드 클릭 시 상세 페이지 이동

**표시 정보:**
- 가게명, 카테고리, 영업상태
- 평점 및 리뷰 수
- 배달시간, 배달비, 최소주문금액

#### 5. 가게 상세 (`/stores/[storeId]`)
**기능:**
- 가게 상세 정보 조회
- 메뉴 목록 표시
- 공구방 만들기 버튼

**표시 정보:**
- 가게 상세 정보 (주소, 전화번호, 영업시간)
- 메뉴 목록 (이름, 가격, 이미지, 설명)
- 인기 메뉴 표시
- 품절 메뉴 표시

#### 6. 공구방 (`/rooms/[roomId]`)
**기능:**
- 공구방 정보 표시 (배달비, 최소주문금액)
- 참가자 목록 조회
- 메뉴 추가 (드롭다운 선택 + 수량 입력)
- 장바구니 관리 (메뉴 삭제)
- 정산 방법 선택 (방장만)
  - 메뉴별 정산: 각자 주문한 메뉴만 결제
  - N분의 1: 전체 금액을 인원수로 나눔
- 결제 요청 (방장만, 최소주문금액 달성 시)

**권한:**
- 방장: 정산 방법 선택, 결제 요청 가능
- 참가자: 메뉴 추가/삭제 가능

**장바구니 정보:**
- 각 메뉴별 주문자, 수량, 가격
- 총 주문 금액
- 배달비
- 최종 금액
- 최소 주문 금액 달성 여부

#### 7. 결제 페이지 (`/rooms/[roomId]/payment`)
**기능:**
- 개인별 결제 금액 자동 계산
- 결제 방법 선택 (카카오페이, 네이버페이, 토스페이, 카드)
- 결제 완료 처리
- 전체 결제 현황 확인

**표시 정보:**
- 내 메뉴 금액
- 배달비 분담금
- 총 결제 금액
- 전체 참가자 결제 상태

## 페이지 플로우

```
메인 (/)
  → 회원가입 (/auth/signup)
  → 로그인 (/auth/login)
  → 가게 목록 (/stores)
  → 가게 상세 (/stores/[storeId])
  → 공구방 생성 → 공구방 (/rooms/[roomId])
  → 메뉴 추가
  → 정산 방법 선택 (방장)
  → 결제 요청 (방장)
  → 결제 (/rooms/[roomId]/payment)
  → 결제 완료 → 가게 목록으로
```

## API 연동 현황

### 인증
- ✅ POST `/api/auth/signup` - 회원가입
- ✅ POST `/api/auth/login` - 로그인

### 가게
- ✅ GET `/api/stores` - 가게 목록
- ✅ GET `/api/stores/{storeId}` - 가게 상세
- ✅ GET `/api/stores/{storeId}/menus` - 메뉴 목록

### 공구방
- ✅ POST `/api/rooms` - 공구방 생성
- ✅ GET `/api/rooms/{roomId}` - 공구방 상세
- ✅ POST `/api/rooms/{roomId}/participants` - 참가자 추가
- ✅ DELETE `/api/rooms/{roomId}/participants/{userId}` - 참가자 나가기

### 장바구니
- ✅ GET `/api/rooms/{roomId}/cart` - 장바구니 조회
- ✅ POST `/api/rooms/{roomId}/menu` - 메뉴 추가
- ✅ DELETE `/api/rooms/{roomId}/menu/{menuId}` - 메뉴 삭제

### 정산
- ✅ POST `/api/rooms/{roomId}/settlement-method` - 정산 방법 선택
- ✅ GET `/api/rooms/{roomId}/calculate/{userId}` - 개인별 금액 계산

### 결제
- ✅ POST `/api/rooms/{roomId}/payment-request` - 결제 요청
- ✅ POST `/api/rooms/{roomId}/payment/{userId}` - 결제 완료
- ✅ GET `/api/rooms/{roomId}/payment-status` - 결제 상태 조회

## 전역 상태 관리

### AuthContext
**위치:** `lib/contexts/AuthContext.tsx`

**제공하는 값:**
- `user`: 현재 로그인한 사용자 정보
- `isAuthenticated`: 로그인 여부
- `isLoading`: 로딩 상태
- `login(email, password)`: 로그인 함수
- `logout()`: 로그아웃 함수

**사용 예시:**
```typescript
import { useAuth } from '@/lib/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>로그인이 필요합니다</div>;
  }

  return <div>안녕하세요, {user.nickname}님!</div>;
}
```

## 라우팅 가드

모든 메인 서비스 페이지는 인증이 필요합니다:
- `/stores/*` - 로그인 필요
- `/rooms/*` - 로그인 필요

미인증 사용자 접근 시 자동으로 `/auth/login`으로 리다이렉트됩니다.

## UI 컴포넌트

모든 페이지에서 공통 UI 컴포넌트를 사용합니다:
- **Button** - 다양한 variant (primary, secondary, outline, danger)
- **Input** - 라벨, 에러 메시지, 헬퍼 텍스트 지원
- **Card** - 카드 레이아웃 (Header, Title, Content, Footer)
- **Header** - 네비게이션 헤더 (로그인/로그아웃 상태 표시)

## 에러 처리

모든 API 호출에는 try-catch 블록이 적용되어 있으며:
- 에러 발생 시 사용자에게 alert로 알림
- 콘솔에 에러 로그 출력
- 필요 시 이전 페이지로 돌아가기

## 반응형 디자인

모든 페이지는 반응형으로 구현되어 있습니다:
- 모바일: 1열 그리드
- 태블릿: 2열 그리드
- 데스크톱: 3-4열 그리드

## 다음 단계

추가로 구현할 수 있는 기능:
1. ⏰ 실시간 업데이트 (WebSocket)
2. 📱 공구방 링크 공유
3. 💬 채팅 기능
4. 📍 배달 주소 지도 표시
5. 🔔 알림 기능
6. 📊 주문 내역 조회
7. ⭐ 가게 리뷰 작성
8. 🎯 찜하기 기능
