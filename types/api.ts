/**
 * 배민투게더 API 타입 정의
 */

// Enums
export enum SettlementMethod {
  MENU_BASED = 'MENU_BASED',
  EQUAL_SPLIT = 'EQUAL_SPLIT',
}

export enum PaymentMethod {
  CARD = 'CARD',
  KAKAO_PAY = 'KAKAO_PAY',
  NAVER_PAY = 'NAVER_PAY',
  TOSS_PAY = 'TOSS_PAY',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  DELIVERING = 'DELIVERING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

// Auth Types
export interface SignupRequest {
  email: string;
  password: string;
  nickname: string;
  phoneNumber: string;
  roadAddress: string;
  detailAddress?: string;
  zipCode?: string;
}

export interface SignupResponse {
  userId: string;
  email: string;
  nickname: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userId: string;
  email: string;
  nickname: string;
}

// Store Types
export interface StoreDto {
  storeId: string;
  storeName: string;
  category: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrderAmount: number;
  thumbnailUrl: string;
  isOpen: boolean;
}

export interface StoreListResponse {
  stores: StoreDto[];
}

export interface StoreDetailResponse {
  storeId: string;
  storeName: string;
  category: string;
  description: string;
  rating: number;
  reviewCount: number;
  deliveryTime: string;
  deliveryFee: number;
  minimumOrderAmount: number;
  address: string;
  phoneNumber: string;
  weekdayHours: string;
  weekendHours: string;
  thumbnailUrl: string;
  isOpen: boolean;
  notice: string;
}

export interface MenuDto {
  menuId: string;
  menuName: string;
  description: string;
  price: number;
  imageUrl: string;
  isPopular: boolean;
  isAvailable: boolean;
}

export interface MenuListResponse {
  menus: MenuDto[];
}

// Room Types
export interface CreateRoomRequest {
  hostId: string;
  storeId: string;
  storeName: string;
  deliveryFee: number;
  minimumOrderAmount: number;
}

export interface CreateRoomResponse {
  roomId: string;
  hostId: string;
  storeId: string;
  storeName: string;
  deliveryFee: number;
  minimumOrderAmount: number;
}

export interface ParticipantDto {
  userId: string;
  nickname: string;
  isHost: boolean;
}

export interface RoomDetailResponse {
  roomId: string;
  hostId: string;
  storeId: string;
  storeName: string;
  deliveryFee: number;
  minimumOrderAmount: number;
  participants: ParticipantDto[];
}

// Participant Types
export interface JoinRoomRequest {
  userId: string;
  nickname: string;
}

export interface JoinRoomResponse {
  participantId: string;
  roomId: string;
  userId: string;
  nickname: string;
  isHost: boolean;
  currentParticipants: number;
}

// Cart Types
export interface MenuOptionRequest {
  optionName: string;
  choiceName: string;
  additionalPrice: number;
}

export interface AddMenuRequest {
  userId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  price: number;
  options?: MenuOptionRequest[];
}

export interface AddMenuResponse {
  cartItemId: string;
  roomId: string;
  userId: string;
  menuId: string;
  menuName: string;
  quantity: number;
  totalPrice: number;
}

export interface OptionDto {
  optionName: string;
  choiceName: string;
  additionalPrice: number;
}

export interface CartItemDto {
  cartItemId: string;
  userId: string;
  nickname: string;
  menuName: string;
  quantity: number;
  price: number;
  totalPrice: number;
  options: OptionDto[];
}

export interface CartResponse {
  roomId: string;
  items: CartItemDto[];
  totalAmount: number;
  deliveryFee: number;
  finalAmount: number;
  minimumOrderMet: boolean;
}

// Order Types
export interface CreateOrderRequest {
  roomId: string;
  deliveryAddress: string;
}

export interface CreateOrderResponse {
  orderId: string;
  roomId: string;
  storeId: string;
  storeName: string;
  totalAmount: number;
  deliveryFee: number;
  deliveryAddress: string;
  status: OrderStatus;
  orderedAt: string;
}

// Settlement Types
export interface SelectSettlementMethodRequest {
  hostId: string;
  settlementMethod: SettlementMethod;
}

export interface SelectSettlementMethodResponse {
  settlementId: string;
  roomId: string;
  settlementMethod: SettlementMethod;
}

export interface CalculateAmountResponse {
  userId: string;
  userMenuTotal: number;
  deliveryFeeShare: number;
  finalAmount: number;
}

// Payment Types
export interface PaymentRequestRequest {
  hostId: string;
}

export interface PaymentRequestResponse {
  roomId: string;
  message: string;
  totalParticipants: number;
}

export interface CompletePaymentRequest {
  paymentMethod: PaymentMethod;
  paymentKey: string;
  amount: number;
}

export interface CompletePaymentResponse {
  paymentId: string;
  roomId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
  allPaid: boolean;
  paidCount: number;
  totalParticipants: number;
}

export interface PaymentDto {
  paymentId: string;
  userId: string;
  nickname: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
}

export interface PaymentStatusResponse {
  allPaid: boolean;
  paidCount: number;
  totalParticipants: number;
  payments: PaymentDto[];
}
