/**
 * 배민투게더 API 클라이언트
 */

import { API_BASE_URL, API_ENDPOINTS } from './endpoints';
import type {
  // Auth
  SignupRequest,
  SignupResponse,
  LoginRequest,
  LoginResponse,
  // Stores
  StoreListResponse,
  StoreDetailResponse,
  MenuListResponse,
  // Rooms
  CreateRoomRequest,
  CreateRoomResponse,
  RoomDetailResponse,
  // Participants
  JoinRoomRequest,
  JoinRoomResponse,
  // Cart
  AddMenuRequest,
  AddMenuResponse,
  CartResponse,
  // Order
  CreateOrderRequest,
  CreateOrderResponse,
  // Settlement
  SelectSettlementMethodRequest,
  SelectSettlementMethodResponse,
  CalculateAmountResponse,
  // Payment
  PaymentRequestRequest,
  PaymentRequestResponse,
  CompletePaymentRequest,
  CompletePaymentResponse,
  PaymentStatusResponse,
} from '@/types/api';

class BaeminApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    url: string,
    options?: RequestInit
  ): Promise<T> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
    };

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers: {
        ...headers,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ===== Auth =====
  async signup(data: SignupRequest): Promise<SignupResponse> {
    return this.request(API_ENDPOINTS.AUTH.SIGNUP, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );

    // 자동으로 토큰 설정
    if (response.accessToken) {
      this.setToken(response.accessToken);
    }

    return response;
  }

  // ===== Stores =====
  async getStores(params?: {
    category?: string;
    sortBy?: string;
  }): Promise<StoreListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    const url = `${API_ENDPOINTS.STORES.LIST}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request(url);
  }

  async getStoreDetail(storeId: string): Promise<StoreDetailResponse> {
    return this.request(API_ENDPOINTS.STORES.DETAIL(storeId));
  }

  async getMenus(storeId: string): Promise<MenuListResponse> {
    return this.request(API_ENDPOINTS.STORES.MENUS(storeId));
  }

  // ===== Rooms =====
  async createRoom(data: CreateRoomRequest): Promise<CreateRoomResponse> {
    return this.request(API_ENDPOINTS.ROOMS.CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRoomDetail(roomId: string): Promise<RoomDetailResponse> {
    return this.request(API_ENDPOINTS.ROOMS.DETAIL(roomId));
  }

  async deleteRoom(roomId: string): Promise<void> {
    return this.request(API_ENDPOINTS.ROOMS.DELETE(roomId), {
      method: 'DELETE',
    });
  }

  // ===== Participants =====
  async joinRoom(roomId: string, data: JoinRoomRequest): Promise<JoinRoomResponse> {
    return this.request(API_ENDPOINTS.PARTICIPANTS.JOIN(roomId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async leaveRoom(roomId: string, userId: string): Promise<void> {
    return this.request(API_ENDPOINTS.PARTICIPANTS.LEAVE(roomId, userId), {
      method: 'DELETE',
    });
  }

  // ===== Cart =====
  async getCart(roomId: string): Promise<CartResponse> {
    return this.request(API_ENDPOINTS.CART.GET(roomId));
  }

  async addMenu(roomId: string, data: AddMenuRequest): Promise<AddMenuResponse> {
    return this.request(API_ENDPOINTS.CART.ADD_MENU(roomId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteCartItem(roomId: string, menuId: string): Promise<void> {
    return this.request(API_ENDPOINTS.CART.DELETE_ITEM(roomId, menuId), {
      method: 'DELETE',
    });
  }

  // ===== Order =====
  async createOrder(roomId: string, data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return this.request(API_ENDPOINTS.ORDER.CREATE(roomId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== Settlement =====
  async selectSettlementMethod(
    roomId: string,
    data: SelectSettlementMethodRequest
  ): Promise<SelectSettlementMethodResponse> {
    return this.request(API_ENDPOINTS.SETTLEMENT.SELECT_METHOD(roomId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async calculateAmount(
    roomId: string,
    userId: string
  ): Promise<CalculateAmountResponse> {
    return this.request(API_ENDPOINTS.SETTLEMENT.CALCULATE(roomId, userId));
  }

  // ===== Payment =====
  async requestPayment(
    roomId: string,
    data: PaymentRequestRequest
  ): Promise<PaymentRequestResponse> {
    return this.request(API_ENDPOINTS.PAYMENT.REQUEST(roomId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async completePayment(
    roomId: string,
    userId: string,
    data: CompletePaymentRequest
  ): Promise<CompletePaymentResponse> {
    return this.request(API_ENDPOINTS.PAYMENT.COMPLETE(roomId, userId), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPaymentStatus(roomId: string): Promise<PaymentStatusResponse> {
    return this.request(API_ENDPOINTS.PAYMENT.STATUS(roomId));
  }
}

// 싱글톤 인스턴스 export
export const baeminApi = new BaeminApiClient();

// 클래스도 export (테스트나 커스텀 인스턴스 생성용)
export { BaeminApiClient };
