# 배민투게더 API 가이드

## 서비스 개요

**배민투게더**는 배달 공동구매 플랫폼입니다. 여러 명이 함께 음식을 주문하여 배달비를 나눠내고, 정산을 자동화하는 서비스입니다.

## 주요 기능

### 1. 인증 (Authentication)
- 회원가입
- 로그인 (JWT 토큰 발급)

### 2. 가게 탐색 (Store)
- 가게 목록 조회 (카테고리, 정렬 필터링)
- 가게 상세 정보 조회
- 메뉴 목록 조회

### 3. 공구방 (Room)
- 공구방 생성
- 공구방 상세 조회
- 공구방 삭제

### 4. 참가자 (Participant)
- 공구방 참여
- 공구방 나가기

### 5. 장바구니 (Cart)
- 메뉴 추가 (옵션 포함)
- 장바구니 조회
- 메뉴 삭제

### 6. 주문 (Order)
- 주문 생성

### 7. 정산 (Settlement)
- 정산 방법 선택
  - `MENU_BASED`: 메뉴별 정산 (각자 주문한 메뉴 금액만 부담)
  - `EQUAL_SPLIT`: N분의 1 정산 (전체 금액을 인원수로 나눔)
- 개인별 결제 금액 계산

### 8. 결제 (Payment)
- 결제 요청
- 결제 완료 처리
- 결제 상태 조회

## API 사용 예시

### 기본 설정

```typescript
import { baeminApi } from '@/lib/api/baemin-api';
```

### 1. 회원가입

```typescript
const signupData = {
  email: 'user@example.com',
  password: 'password123',
  nickname: '홍길동',
  phoneNumber: '010-1234-5678',
  roadAddress: '서울시 강남구 테헤란로 123',
  detailAddress: '101호',
  zipCode: '06234'
};

const response = await baeminApi.signup(signupData);
console.log('User ID:', response.userId);
```

### 2. 로그인

```typescript
const loginData = {
  email: 'user@example.com',
  password: 'password123'
};

const response = await baeminApi.login(loginData);
// 토큰은 자동으로 저장됨
console.log('Access Token:', response.accessToken);
```

### 3. 가게 목록 조회

```typescript
// 전체 가게 조회
const stores = await baeminApi.getStores();

// 필터링된 가게 조회
const filteredStores = await baeminApi.getStores({
  category: '한식',
  sortBy: 'rating'
});

console.log('가게 목록:', filteredStores.stores);
```

### 4. 가게 상세 정보 조회

```typescript
const storeId = 'store123';
const storeDetail = await baeminApi.getStoreDetail(storeId);

console.log('가게명:', storeDetail.storeName);
console.log('배달비:', storeDetail.deliveryFee);
console.log('영업시간:', storeDetail.weekdayHours);
```

### 5. 메뉴 조회

```typescript
const storeId = 'store123';
const menus = await baeminApi.getMenus(storeId);

console.log('메뉴 목록:', menus.menus);
```

### 6. 공구방 생성

```typescript
const roomData = {
  hostId: 'user123',
  storeId: 'store456',
  storeName: '맛있는 치킨',
  deliveryFee: 3000,
  minimumOrderAmount: 15000
};

const room = await baeminApi.createRoom(roomData);
console.log('생성된 방 ID:', room.roomId);
```

### 7. 공구방 참여

```typescript
const roomId = 'room123';
const joinData = {
  userId: 'user456',
  nickname: '홍길동'
};

const participant = await baeminApi.joinRoom(roomId, joinData);
console.log('참가자 ID:', participant.participantId);
console.log('현재 참가자 수:', participant.currentParticipants);
```

### 8. 공구방 상세 조회

```typescript
const roomId = 'room123';
const roomDetail = await baeminApi.getRoomDetail(roomId);

console.log('방장:', roomDetail.hostId);
console.log('참가자 목록:', roomDetail.participants);
```

### 9. 장바구니에 메뉴 추가

```typescript
const roomId = 'room123';
const menuData = {
  userId: 'user123',
  menuId: 'menu456',
  menuName: '양념치킨',
  quantity: 2,
  price: 18000,
  options: [
    {
      optionName: '맵기',
      choiceName: '순한맛',
      additionalPrice: 0
    },
    {
      optionName: '음료',
      choiceName: '콜라',
      additionalPrice: 2000
    }
  ]
};

const cartItem = await baeminApi.addMenu(roomId, menuData);
console.log('장바구니 아이템 ID:', cartItem.cartItemId);
console.log('총 가격:', cartItem.totalPrice);
```

### 10. 장바구니 조회

```typescript
const roomId = 'room123';
const cart = await baeminApi.getCart(roomId);

console.log('장바구니 항목:', cart.items);
console.log('총 금액:', cart.totalAmount);
console.log('배달비:', cart.deliveryFee);
console.log('최종 금액:', cart.finalAmount);
console.log('최소 주문 금액 달성:', cart.minimumOrderMet);
```

### 11. 장바구니 항목 삭제

```typescript
const roomId = 'room123';
const menuId = 'menu456';

await baeminApi.deleteCartItem(roomId, menuId);
```

### 12. 주문 생성

```typescript
const roomId = 'room123';
const orderData = {
  roomId: 'room123',
  deliveryAddress: '서울시 강남구 테헤란로 123, 101호'
};

const order = await baeminApi.createOrder(roomId, orderData);
console.log('주문 ID:', order.orderId);
console.log('주문 상태:', order.status);
console.log('총 금액:', order.totalAmount);
```

### 13. 정산 방법 선택

```typescript
import { SettlementMethod } from '@/types/api';

const roomId = 'room123';

// 메뉴별 정산
const settlement = await baeminApi.selectSettlementMethod(roomId, {
  hostId: 'user123',
  settlementMethod: SettlementMethod.MENU_BASED
});

// 또는 N분의 1 정산
const equalSplit = await baeminApi.selectSettlementMethod(roomId, {
  hostId: 'user123',
  settlementMethod: SettlementMethod.EQUAL_SPLIT
});

console.log('정산 ID:', settlement.settlementId);
console.log('정산 방법:', settlement.settlementMethod);
```

### 14. 개인별 결제 금액 계산

```typescript
const roomId = 'room123';
const userId = 'user123';

const amount = await baeminApi.calculateAmount(roomId, userId);

console.log('내 메뉴 금액:', amount.userMenuTotal);
console.log('배달비 분담금:', amount.deliveryFeeShare);
console.log('최종 결제 금액:', amount.finalAmount);
```

### 15. 결제 요청

```typescript
const roomId = 'room123';

const paymentRequest = await baeminApi.requestPayment(roomId, {
  hostId: 'user123'
});

console.log('결제 요청 메시지:', paymentRequest.message);
console.log('총 참가자 수:', paymentRequest.totalParticipants);
```

### 16. 결제 완료

```typescript
import { PaymentMethod } from '@/types/api';

const roomId = 'room123';
const userId = 'user123';

const payment = await baeminApi.completePayment(roomId, userId, {
  paymentMethod: PaymentMethod.KAKAO_PAY,
  paymentKey: 'payment_key_from_pg',
  amount: 12000
});

console.log('결제 ID:', payment.paymentId);
console.log('결제 상태:', payment.status);
console.log('전체 결제 완료:', payment.allPaid);
console.log('결제 완료 인원:', payment.paidCount, '/', payment.totalParticipants);
```

### 17. 결제 상태 조회

```typescript
const roomId = 'room123';

const status = await baeminApi.getPaymentStatus(roomId);

console.log('전체 결제 완료:', status.allPaid);
console.log('결제 완료 인원:', status.paidCount, '/', status.totalParticipants);
console.log('결제 내역:', status.payments);
```

### 18. 공구방 나가기

```typescript
const roomId = 'room123';
const userId = 'user456';

await baeminApi.leaveRoom(roomId, userId);
```

### 19. 공구방 삭제 (방장만 가능)

```typescript
const roomId = 'room123';

await baeminApi.deleteRoom(roomId);
```

## 에러 처리

```typescript
try {
  const response = await baeminApi.login({
    email: 'user@example.com',
    password: 'wrongpassword'
  });
} catch (error) {
  console.error('로그인 실패:', error);
  // 에러 처리 로직
}
```

## 인증 토큰 관리

```typescript
// 토큰은 로그인 시 자동으로 설정됩니다
await baeminApi.login({ email: '...', password: '...' });

// 수동으로 토큰 설정
baeminApi.setToken('your-jwt-token');

// 토큰 제거 (로그아웃)
baeminApi.clearToken();
```

## 전체 플로우 예시

```typescript
// 1. 로그인
const loginResponse = await baeminApi.login({
  email: 'host@example.com',
  password: 'password123'
});

// 2. 가게 찾기
const stores = await baeminApi.getStores({ category: '치킨' });
const selectedStore = stores.stores[0];

// 3. 공구방 생성
const room = await baeminApi.createRoom({
  hostId: loginResponse.userId,
  storeId: selectedStore.storeId,
  storeName: selectedStore.storeName,
  deliveryFee: selectedStore.deliveryFee,
  minimumOrderAmount: selectedStore.minimumOrderAmount
});

// 4. 메뉴 조회
const menus = await baeminApi.getMenus(selectedStore.storeId);

// 5. 메뉴 추가
await baeminApi.addMenu(room.roomId, {
  userId: loginResponse.userId,
  menuId: menus.menus[0].menuId,
  menuName: menus.menus[0].menuName,
  quantity: 1,
  price: menus.menus[0].price
});

// 6. 다른 사용자 참여
await baeminApi.joinRoom(room.roomId, {
  userId: 'user456',
  nickname: '참가자1'
});

// 7. 정산 방법 선택
await baeminApi.selectSettlementMethod(room.roomId, {
  hostId: loginResponse.userId,
  settlementMethod: SettlementMethod.MENU_BASED
});

// 8. 개인별 결제 금액 확인
const amount = await baeminApi.calculateAmount(room.roomId, loginResponse.userId);

// 9. 결제 요청
await baeminApi.requestPayment(room.roomId, {
  hostId: loginResponse.userId
});

// 10. 결제 완료
await baeminApi.completePayment(room.roomId, loginResponse.userId, {
  paymentMethod: PaymentMethod.KAKAO_PAY,
  paymentKey: 'payment_key',
  amount: amount.finalAmount
});

// 11. 결제 상태 확인
const paymentStatus = await baeminApi.getPaymentStatus(room.roomId);
```

## API 엔드포인트 목록

| 기능 | 메서드 | 엔드포인트 | 설명 |
|------|--------|-----------|------|
| 회원가입 | POST | `/api/auth/signup` | 새 계정 생성 |
| 로그인 | POST | `/api/auth/login` | 로그인 및 토큰 발급 |
| 가게 목록 | GET | `/api/stores` | 가게 목록 조회 |
| 가게 상세 | GET | `/api/stores/{storeId}` | 가게 상세 정보 |
| 메뉴 목록 | GET | `/api/stores/{storeId}/menus` | 가게 메뉴 목록 |
| 방 생성 | POST | `/api/rooms` | 공구방 생성 |
| 방 상세 | GET | `/api/rooms/{roomId}` | 공구방 상세 정보 |
| 방 삭제 | DELETE | `/api/rooms/{roomId}` | 공구방 삭제 |
| 방 참여 | POST | `/api/rooms/{roomId}/participants` | 공구방 참여 |
| 방 나가기 | DELETE | `/api/rooms/{roomId}/participants/{userId}` | 공구방 나가기 |
| 장바구니 조회 | GET | `/api/rooms/{roomId}/cart` | 장바구니 조회 |
| 메뉴 추가 | POST | `/api/rooms/{roomId}/menu` | 장바구니에 메뉴 추가 |
| 메뉴 삭제 | DELETE | `/api/rooms/{roomId}/menu/{menuId}` | 장바구니 메뉴 삭제 |
| 주문 생성 | POST | `/api/rooms/{roomId}/order` | 주문 생성 |
| 정산 방법 선택 | POST | `/api/rooms/{roomId}/settlement-method` | 정산 방법 선택 |
| 금액 계산 | GET | `/api/rooms/{roomId}/calculate/{userId}` | 개인별 결제 금액 계산 |
| 결제 요청 | POST | `/api/rooms/{roomId}/payment-request` | 결제 요청 |
| 결제 완료 | POST | `/api/rooms/{roomId}/payment/{userId}` | 결제 완료 처리 |
| 결제 상태 | GET | `/api/rooms/{roomId}/payment-status` | 결제 상태 조회 |

## 참고사항

- API Base URL: `http://35.216.1.9:8080`
- 인증 방식: JWT Bearer Token
- 모든 요청/응답은 JSON 형식
- 로그인 후 받은 토큰은 자동으로 API 클라이언트에 저장됨
