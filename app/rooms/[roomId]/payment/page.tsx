'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from '@/components/ui';
import { Header } from '@/components/layout';
import { baeminApi } from '@/lib/api/baemin-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import type {
  CalculateAmountResponse,
  PaymentStatusResponse,
  PaymentMethod,
} from '@/types/api';

export default function PaymentPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [myAmount, setMyAmount] = useState<CalculateAmountResponse | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('KAKAO_PAY' as PaymentMethod);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const loadPaymentData = useCallback(async (isPolling = false) => {
    if (!user) return;

    if (!isPolling) setIsLoading(true);
    try {
      const [amount, status] = await Promise.all([
        baeminApi.calculateAmount(resolvedParams.roomId, user.userId),
        baeminApi.getPaymentStatus(resolvedParams.roomId),
      ]);

      setMyAmount(amount);
      setPaymentStatus(status);
    } catch (error) {
      console.error('Failed to load payment data:', error);
    } finally {
      if (!isPolling) setIsLoading(false);
    }
  }, [user, resolvedParams.roomId]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/auth/login');
      return;
    }

    loadPaymentData();

    // 3초마다 폴링
    const interval = setInterval(() => {
      loadPaymentData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user, resolvedParams.roomId, loadPaymentData, router]);

  const handlePayment = async () => {
    if (!user || !myAmount) return;

    setIsPaying(true);
    try {
      // 실제 PG 결제 연동 시뮬레이션
      const paymentKey = `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await baeminApi.completePayment(
        resolvedParams.roomId,
        user.userId,
        {
          paymentMethod: selectedMethod,
          paymentKey,
          amount: myAmount.finalAmount,
        }
      );

      if (response.status === 'COMPLETED') {
        alert('결제가 완료되었습니다!');

        if (response.allPaid) {
          alert('모든 참가자의 결제가 완료되었습니다! 🎉');
        }

        await loadPaymentData();
      } else {
        alert('결제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsPaying(false);
    }
  };

  const isMyPaymentComplete = paymentStatus?.payments.find(
    (p) => p.userId === user?.userId
  )?.status === 'COMPLETED';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!myAmount || !paymentStatus) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-600">결제 정보를 찾을 수 없습니다.</p>
          <Button className="mt-4" onClick={() => router.push('/stores')}>
            가게 목록으로
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">결제하기</h1>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* 내 결제 금액 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>내 결제 금액</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">내 메뉴 금액</span>
                  <span className="font-medium">
                    {myAmount.userMenuTotal.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">배달비 분담금</span>
                  <span className="font-medium">
                    {myAmount.deliveryFeeShare.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t pt-3">
                  <span>총 결제 금액</span>
                  <span className="text-blue-600">
                    {myAmount.finalAmount.toLocaleString()}원
                  </span>
                </div>
              </div>

              {!isMyPaymentComplete && (
                <>
                  <div className="mt-6">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      결제 방법
                    </label>
                    <div className="space-y-2">
                      {[
                        { value: 'KAKAO_PAY', label: '카카오페이' },
                        { value: 'NAVER_PAY', label: '네이버페이' },
                        { value: 'TOSS_PAY', label: '토스페이' },
                        { value: 'CARD', label: '신용카드' },
                      ].map((method) => (
                        <button
                          key={method.value}
                          className={`w-full p-3 text-left border-2 rounded-lg transition-colors ${
                            selectedMethod === method.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedMethod(method.value as PaymentMethod)}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full mt-6"
                    onClick={handlePayment}
                    isLoading={isPaying}
                  >
                    {myAmount.finalAmount.toLocaleString()}원 결제하기
                  </Button>
                </>
              )}

              {isMyPaymentComplete && (
                <div className="mt-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
                  ✅ 결제 완료
                </div>
              )}
            </CardContent>
          </Card>

          {/* 결제 현황 */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle>
                결제 현황 ({paymentStatus.paidCount}/{paymentStatus.totalParticipants})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {paymentStatus.allPaid && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center font-medium">
                  🎉 모든 참가자의 결제가 완료되었습니다!
                </div>
              )}

              <div className="space-y-3">
                {paymentStatus.payments.map((payment) => (
                  <div
                    key={payment.paymentId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-semibold">{payment.nickname}</p>
                      <p className="text-sm text-gray-600">
                        {payment.amount.toLocaleString()}원
                      </p>
                      {payment.paymentMethod && (
                        <p className="text-xs text-gray-500">
                          {payment.paymentMethod === 'KAKAO_PAY' && '카카오페이'}
                          {payment.paymentMethod === 'NAVER_PAY' && '네이버페이'}
                          {payment.paymentMethod === 'TOSS_PAY' && '토스페이'}
                          {payment.paymentMethod === 'CARD' && '신용카드'}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-sm ${
                        payment.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {payment.status === 'COMPLETED' && '완료'}
                      {payment.status === 'PENDING' && '대기'}
                      {payment.status === 'FAILED' && '실패'}
                      {payment.status === 'CANCELLED' && '취소'}
                    </span>
                  </div>
                ))}
              </div>

              {paymentStatus.allPaid && (
                <Button
                  variant="primary"
                  className="w-full mt-6"
                  onClick={() => router.push('/stores')}
                >
                  홈으로 돌아가기
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
