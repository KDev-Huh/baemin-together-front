/**
 * 배민투게더 API 엔드포인트
 */

// 브라우저에서는 프록시 사용, 서버에서는 직접 호출
export const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api/baemin'  // 클라이언트: Next.js API 프록시 사용
    : process.env.BAEMIN_API_URL || 'http://35.216.1.9:8080';  // 서버: 직접 호출

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    SIGNUP: '/auth/signup',
    LOGIN: '/auth/login',
  },

  // Stores
  STORES: {
    LIST: '/stores',
    DETAIL: (storeId: string) => `/stores/${storeId}`,
    MENUS: (storeId: string) => `/stores/${storeId}/menus`,
  },

  // Rooms
  ROOMS: {
    CREATE: '/rooms',
    DETAIL: (roomId: string) => `/rooms/${roomId}`,
    DELETE: (roomId: string) => `/rooms/${roomId}`,
  },

  // Participants
  PARTICIPANTS: {
    JOIN: (roomId: string) => `/rooms/${roomId}/participants`,
    LEAVE: (roomId: string, userId: string) => `/rooms/${roomId}/participants/${userId}`,
  },

  // Cart
  CART: {
    GET: (roomId: string) => `/rooms/${roomId}/cart`,
    ADD_MENU: (roomId: string) => `/rooms/${roomId}/menu`,
    DELETE_ITEM: (roomId: string, menuId: string) => `/rooms/${roomId}/menu/${menuId}`,
  },

  // Order
  ORDER: {
    CREATE: (roomId: string) => `/rooms/${roomId}/order`,
  },

  // Settlement
  SETTLEMENT: {
    SELECT_METHOD: (roomId: string) => `/rooms/${roomId}/settlement-method`,
    CALCULATE: (roomId: string, userId: string) => `/rooms/${roomId}/calculate/${userId}`,
  },

  // Payment
  PAYMENT: {
    REQUEST: (roomId: string) => `/rooms/${roomId}/payment-request`,
    COMPLETE: (roomId: string, userId: string) => `/rooms/${roomId}/payment/${userId}`,
    STATUS: (roomId: string) => `/rooms/${roomId}/payment-status`,
  },
} as const;
