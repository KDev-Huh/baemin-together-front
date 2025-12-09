'use client';

import { useState } from 'react';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { baeminApi } from '@/lib/api/baemin-api';
import type { LoginRequest, StoreDto } from '@/types/api';

export default function ExamplesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [stores, setStores] = useState<StoreDto[]>([]);

  // 1. 로그인 예시
  const handleLogin = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const loginData: LoginRequest = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await baeminApi.login(loginData);
      setResult(JSON.stringify(response, null, 2));
      alert('로그인 성공!');
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 가게 목록 조회 예시
  const handleGetStores = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const response = await baeminApi.getStores({
        category: '한식',
        sortBy: 'rating',
      });

      setStores(response.stores);
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 방 생성 예시
  const handleCreateRoom = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const response = await baeminApi.createRoom({
        hostId: 'user123',
        storeId: 'store456',
        storeName: '맛있는 치킨',
        deliveryFee: 3000,
        minimumOrderAmount: 15000,
      });

      setResult(JSON.stringify(response, null, 2));
      alert(`방 생성 완료! Room ID: ${response.roomId}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 4. 장바구니에 메뉴 추가 예시
  const handleAddMenu = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const roomId = 'room123'; // 실제로는 생성된 방 ID 사용

      const response = await baeminApi.addMenu(roomId, {
        userId: 'user123',
        menuId: 'menu456',
        menuName: '양념치킨',
        quantity: 2,
        price: 18000,
        options: [
          {
            optionName: '맵기',
            choiceName: '순한맛',
            additionalPrice: 0,
          },
        ],
      });

      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. 정산 금액 계산 예시
  const handleCalculateAmount = async () => {
    setIsLoading(true);
    setResult('');
    try {
      const roomId = 'room123';
      const userId = 'user123';

      const response = await baeminApi.calculateAmount(roomId, userId);

      setResult(JSON.stringify(response, null, 2));
      alert(`내 결제 금액: ${response.finalAmount}원`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <main className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            배민투게더 API 사용 예시
          </h1>
          <p className="text-gray-600">
            각 버튼을 클릭하여 API 호출 예시를 확인하세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>1. 인증</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="primary"
                onClick={handleLogin}
                isLoading={isLoading}
                className="w-full"
              >
                로그인 테스트
              </Button>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>2. 가게 조회</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="primary"
                onClick={handleGetStores}
                isLoading={isLoading}
                className="w-full"
              >
                가게 목록 조회
              </Button>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>3. 방 생성</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="primary"
                onClick={handleCreateRoom}
                isLoading={isLoading}
                className="w-full"
              >
                공구방 생성
              </Button>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>4. 장바구니</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="primary"
                onClick={handleAddMenu}
                isLoading={isLoading}
                className="w-full"
              >
                메뉴 추가
              </Button>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>5. 정산</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="primary"
                onClick={handleCalculateAmount}
                isLoading={isLoading}
                className="w-full"
              >
                내 금액 계산
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 결과 표시 */}
        {result && (
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>API 응답 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                {result}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* 가게 목록 표시 */}
        {stores.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">가게 목록</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store) => (
                <Card key={store.storeId} variant="bordered">
                  <CardContent>
                    <h3 className="font-semibold text-lg mb-2">
                      {store.storeName}
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>⭐ {store.rating} ({store.reviewCount})</p>
                      <p>🚚 {store.deliveryTime}</p>
                      <p>💰 배달비: {store.deliveryFee}원</p>
                      <p>📦 최소주문: {store.minimumOrderAmount}원</p>
                      <p className={store.isOpen ? 'text-green-600' : 'text-red-600'}>
                        {store.isOpen ? '🟢 영업중' : '🔴 영업종료'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* API 사용법 가이드 */}
        <Card variant="bordered" className="mt-8">
          <CardHeader>
            <CardTitle>API 사용법</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-2">기본 사용법</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`import { baeminApi } from '@/lib/api/baemin-api';

// 1. 로그인
const loginResponse = await baeminApi.login({
  email: 'user@example.com',
  password: 'password123'
});

// 2. 가게 목록 조회
const stores = await baeminApi.getStores({
  category: '한식',
  sortBy: 'rating'
});

// 3. 방 생성
const room = await baeminApi.createRoom({
  hostId: 'user123',
  storeId: 'store456',
  storeName: '맛있는 치킨',
  deliveryFee: 3000,
  minimumOrderAmount: 15000
});

// 4. 방 참여
const participant = await baeminApi.joinRoom(roomId, {
  userId: 'user456',
  nickname: '홍길동'
});

// 5. 메뉴 추가
const cartItem = await baeminApi.addMenu(roomId, {
  userId: 'user123',
  menuId: 'menu456',
  menuName: '양념치킨',
  quantity: 2,
  price: 18000
});`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
