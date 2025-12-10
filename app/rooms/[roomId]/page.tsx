'use client';

import { useState, useEffect, use, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui';
import { baeminApi } from '@/lib/api/baemin-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { SettlementMethod, PaymentStatusResponse } from '@/types/api';
import type {
  RoomDetailResponse,
  MenuDto,
  CartResponse,
} from '@/types/api';

export default function RoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [room, setRoom] = useState<RoomDetailResponse | null>(null);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<MenuDto | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [settlementMethod, setSettlementMethod] = useState<SettlementMethod | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusResponse | null>(null);

  const loadRoomData = useCallback(async (isPolling = false) => {
    if (!isPolling) setLoading(true);
    try {
      // 1. 방 정보 먼저 로드
      const roomData = await baeminApi.getRoomDetail(resolvedParams.roomId);
      setRoom(roomData);

      // 2. 메뉴 정보 로드
      try {
        const menuData = await baeminApi.getMenus(roomData.storeId);
        setMenus(menuData.menus);
      } catch (err) {
        console.error('Failed to load menus:', err);
      }

      // 3. 참여자인 경우 장바구니 및 결제 상태 로드
      if (user && roomData.participants.some(p => p.userId === user.userId)) {
        try {
          const cartData = await baeminApi.getCart(resolvedParams.roomId);
          setCart(cartData);
        } catch (err) {
          console.error('Failed to load cart:', err);
        }

        try {
          // 결제 상태 확인
          const status = await baeminApi.getPaymentStatus(resolvedParams.roomId);
          if (status && status.payments && status.payments.length > 0) {
            setPaymentStatus(status);
          } else {
            setPaymentStatus(null);
          }
        } catch (_) {
          // 결제가 아직 시작되지 않았을 수 있음
        }
      }
    } catch (err) {
      console.error('Failed to load room data:', err);
      if (!isPolling) setError('공구방 정보를 불러오는데 실패했습니다.');
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, [resolvedParams.roomId, user]);

  useEffect(() => {
    loadRoomData();

    // 3초마다 폴링하여 실시간 업데이트 효과
    const interval = setInterval(() => {
      loadRoomData(true);
    }, 3000);

    return () => clearInterval(interval);
  }, [loadRoomData, isAuthenticated, resolvedParams.roomId, router]);

  const handleJoinRoom = async () => {
    if (!user || !room) return;

    try {
      await baeminApi.joinRoom(room.roomId, { 
        userId: user.userId,
        nickname: user.nickname
      });
      alert('공구방에 참여했습니다!');
      await loadRoomData();
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('공구방 참여에 실패했습니다.');
    }
  };

  /* ... Add Menu & Cart Handlers ... */
  const handleAddMenu = async () => {
    if (!selectedMenu || !user || !room) return;

    try {
      await baeminApi.addMenu(resolvedParams.roomId, {
        userId: user.userId,
        menuId: selectedMenu.menuId,
        menuName: selectedMenu.menuName,
        quantity,
        price: selectedMenu.price,
      });

      alert('메뉴가 추가되었습니다!');
      setSelectedMenu(null);
      setQuantity(1);
      await loadRoomData();
    } catch (error) {
      console.error('Failed to add menu:', error);
      alert('메뉴 추가에 실패했습니다.');
    }
  };

  const handleDeleteCartItem = async (menuId: string) => {
    if (!confirm('이 메뉴를 삭제하시겠습니까?')) return;

    try {
      await baeminApi.deleteCartItem(resolvedParams.roomId, menuId);
      alert('메뉴가 삭제되었습니다.');
      await loadRoomData();
    } catch (error) {
      console.error('Failed to delete cart item:', error);
      alert('메뉴 삭제에 실패했습니다.');
    }
  };

  const handleSelectSettlement = async (method: SettlementMethod) => {
    if (!user || !room) return;

    try {
      await baeminApi.selectSettlementMethod(resolvedParams.roomId, {
        hostId: user.userId,
        settlementMethod: method,
      });

      setSettlementMethod(method);
      alert('정산 방법이 설정되었습니다.');
    } catch (error) {
      console.error('Failed to select settlement method:', error);
      alert('정산 방법 설정에 실패했습니다.');
    }
  };

  const handleRequestPayment = async () => {
    if (!user || !room) return;

    try {
      await baeminApi.requestPayment(resolvedParams.roomId, {
        hostId: user.userId,
      });

      alert('결제 요청이 전송되었습니다!');
      router.push(`/rooms/${resolvedParams.roomId}/payment`);
    } catch (error) {
      console.error('Failed to request payment:', error);
      alert('결제 요청에 실패했습니다.');
    }
  };

  /* Header */
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert('공구방 링크가 복사되었습니다! 친구들에게 공유해보세요.');
    } catch (err) {
      console.error('Failed to copy link:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  const isHost = user && room && room.hostId === user.userId;
  const isParticipant = user && room && room.participants.some(p => p.userId === user.userId);
  const isPaymentActive = !!(paymentStatus && paymentStatus.payments && paymentStatus.payments.length > 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AC1BC]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
           onClick={() => router.push('/stores')}
           className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          가게 목록으로
        </button>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <p className="text-gray-600 mb-4">공구방을 찾을 수 없습니다.</p>
        <button 
           onClick={() => router.push('/stores')}
           className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          가게 목록으로
        </button>
      </div>
    );
  }

  // Case 1: Not Logged In
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-4 text-4xl">👋</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">로그인이 필요해요</h2>
        <p className="text-gray-600 mb-6">공구방에 참여하려면 먼저 로그인해주세요.</p>
        <button
          onClick={() => router.push(`/auth/login?returnUrl=/rooms/${resolvedParams.roomId}`)}
          className="w-full max-w-xs bg-[#2AC1BC] text-white font-bold py-3 rounded-xl hover:bg-[#25B5B0]"
        >
          로그인하러 가기
        </button>
      </div>
    );
  }

  // Case 2: Logged In but Not Participant
  if (!isParticipant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white p-4 border-b border-gray-100 flex items-center gap-3">
           <button onClick={() => router.back()} className="text-gray-800">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
           </button>
           <h1 className="font-bold text-lg text-gray-900">{room.storeName}</h1>
        </header>

        <main className="p-4 flex flex-col items-center pt-20">
           <div className="bg-white p-6 rounded-2xl shadow-sm w-full max-w-sm text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{room.storeName} 공구방</h2>
              <p className="text-gray-600 mb-6">
                현재 <span className="text-[#2AC1BC] font-bold">{room.participants.length}명</span>이 함께하고 있어요.<br/>
                같이 주문하시겠어요?
              </p>
              
              <div className="space-y-2 mb-6 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl">
                 <div className="flex justify-between">
                    <span>배달팁</span>
                    <span>{room.deliveryFee.toLocaleString()}원</span>
                 </div>
                 <div className="flex justify-between">
                    <span>최소주문금액</span>
                    <span>{room.minimumOrderAmount.toLocaleString()}원</span>
                 </div>
              </div>

              <button 
                onClick={handleJoinRoom}
                className="w-full bg-[#2AC1BC] text-white font-bold py-3.5 rounded-xl hover:bg-[#25B5B0] text-lg shadow-md transition-transform active:scale-[0.98]"
              >
                참여하기
              </button>
           </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center px-4 justify-between">
        <div className="flex items-center flex-1 overflow-hidden mr-2">
          <button onClick={() => router.back()} className="mr-3 text-gray-800 shrink-0">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900 truncate">{room.storeName} 공구방</h1>
        </div>
        <button 
          onClick={handleShare}
          className="text-gray-600 hover:text-gray-900 p-1"
          aria-label="공유하기"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </header>

      <main className="max-w-md mx-auto pt-14">
        {/* Participants Status */}
        <div className="bg-white p-4 mb-3">
           <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-gray-900">함께하는 사람들 <span className="text-[#2AC1BC]">{room.participants.length}</span></h2>
              {isHost && <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-full">나는 방장</span>}
           </div>
           <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {room.participants.map((p) => (
                <div key={p.userId} className="flex flex-col items-center shrink-0">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shadow-sm border-2 ${p.isHost ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-white'}`}>
                      {p.nickname[0]}
                   </div>
                   <span className="text-xs mt-1 text-gray-600 truncate w-14 text-center">{p.nickname}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Room Info */}
        <div className="bg-white p-4 mb-3 space-y-2 text-sm">
           <div className="flex justify-between">
              <span className="text-gray-500">배달비</span>
              <span className="font-medium text-gray-900">{room.deliveryFee.toLocaleString()}원</span>
           </div>
           <div className="flex justify-between">
              <span className="text-gray-500">최소주문금액</span>
              <span className="font-medium text-gray-900">{room.minimumOrderAmount.toLocaleString()}원</span>
           </div>
           <div className="pt-2 border-t border-gray-100 mt-2 flex justify-between font-bold">
              <span className="text-gray-900">현재 모인 금액</span>
              <span className={`text-lg ${cart ? (cart.minimumOrderMet ? 'text-[#2AC1BC]' : 'text-red-500') : 'text-gray-400'}`}>
                 {cart ? cart.finalAmount.toLocaleString() : 0}원
              </span>
           </div>
           {cart && !cart.minimumOrderMet && (
              <div className="text-xs text-red-500 text-right mt-1">
                 {(room.minimumOrderAmount - cart.finalAmount).toLocaleString()}원 더 모아야 해요!
              </div>
           )}
        </div>

        {/* Cart Items */}
        <div className="bg-white p-4 mb-3 min-h-[200px]">
           <h2 className="font-bold text-gray-900 mb-4">장바구니</h2>
           {!cart || cart.items.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                 아직 메뉴를 담지 않았어요.
              </div>
           ) : (
              <div className="space-y-4 divide-y divide-gray-100">
                 {cart.items.map((item) => (
                    <div key={item.cartItemId} className="pt-4 first:pt-0">
                       <div className="flex justify-between items-start mb-1">
                          <h3 className="font-medium text-gray-900">{item.menuName}</h3>
                          {user && item.userId === user.userId && (
                             <button onClick={() => handleDeleteCartItem(item.cartItemId)} className="text-xs text-gray-400 underline">삭제</button>
                          )}
                       </div>
                       <div className="flex justify-between text-sm text-gray-600">
                          <span>{item.price.toLocaleString()}원 x {item.quantity}개</span>
                          <span className="font-bold">{item.totalPrice.toLocaleString()}원</span>
                       </div>
                       <div className="mt-1 text-xs text-gray-400 bg-gray-50 inline-block px-1.5 py-0.5 rounded">
                          by {item.nickname}
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>

        {/* Add Menu Section */}
        {!isPaymentActive && (
          <div className="bg-white p-4 mb-3">
             <h2 className="font-bold text-gray-900 mb-3">메뉴 담기</h2>
             <div className="space-y-4 divide-y divide-gray-100">
                {menus.filter((m) => m.isAvailable).map((menu) => (
                   <div key={menu.menuId} className="pt-4 first:pt-0 flex gap-3">
                      {menu.imageUrl && (
                         <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img src={menu.imageUrl} alt={menu.menuName} className="w-full h-full object-cover" />
                         </div>
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                         <div>
                            <h3 className="font-medium text-gray-900">{menu.menuName}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1">{menu.description}</p>
                            <span className="font-bold text-gray-900 mt-1 block">{menu.price.toLocaleString()}원</span>
                         </div>
                         <div className="flex justify-end items-center gap-2 mt-2">
                             {selectedMenu?.menuId === menu.menuId ? (
                               <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                                  <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                                  >
                                    -
                                  </button>
                                  <span className="text-sm font-bold w-4 text-black text-center">{quantity}</span>
                                  <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-7 h-7 flex items-center justify-center bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50"
                                  >
                                    +
                                  </button>
                                  <button 
                                    onClick={handleAddMenu}
                                    className="ml-2 px-3 py-1.5 bg-[#2AC1BC] text-white text-sm font-bold rounded-lg hover:bg-[#25B5B0]"
                                  >
                                    담기
                                  </button>
                                  <button 
                                    onClick={() => { setSelectedMenu(null); setQuantity(1); }}
                                    className="px-2 py-1.5 text-gray-400 hover:text-gray-600"
                                  >
                                    ✕
                                  </button>
                               </div>
                             ) : (
                               <button 
                                 onClick={() => { setSelectedMenu(menu); setQuantity(1); }}
                                 className="px-4 py-2 bg-white border border-[#2AC1BC] text-[#2AC1BC] text-sm font-bold rounded-xl hover:bg-blue-50"
                               >
                                 담기
                               </button>
                             )}
                         </div>
                      </div>
                   </div>
                ))}
            </div>
          </div>
        )}
      </main>

      {/* Payment Button for All Participants */}
      {isPaymentActive && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="max-w-md mx-auto">
              <button
                 onClick={() => router.push(`/rooms/${resolvedParams.roomId}/payment`)}
                 className="w-full py-4 bg-[#2AC1BC] hover:bg-[#25B5B0] text-white font-bold text-lg rounded-xl shadow-md"
              >
                 결제하러 가기
              </button>
           </div>
        </div>
      )}

      {/* Host Controls (only if payment is NOT active yet) */}
      {isHost && !isPaymentActive && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
           <div className="max-w-md mx-auto space-y-3">
              <div className="flex gap-2">
                 <button
                    onClick={() => handleSelectSettlement(SettlementMethod.MENU_BASED)}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm border transition-all ${
                       settlementMethod === SettlementMethod.MENU_BASED 
                          ? 'bg-mint text-black border-mint shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                 >
                    메뉴별 정산
                 </button>
                 <button
                    onClick={() => handleSelectSettlement(SettlementMethod.EQUAL_SPLIT)}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm border transition-all ${
                       settlementMethod === SettlementMethod.EQUAL_SPLIT
                          ? 'bg-mint text-black border-mint shadow-md' 
                          : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                 >
                    N분의 1
                 </button>
              </div>
              <button
                 onClick={handleRequestPayment}
                 disabled={!cart?.minimumOrderMet || !settlementMethod}
                 className={`w-full py-4 font-bold text-lg rounded-xl text-white transition-all ${
                    cart?.minimumOrderMet && settlementMethod
                       ? 'bg-[#2AC1BC] hover:bg-[#25B5B0] shadow-md'
                       : 'bg-gray-300 cursor-not-allowed'
                 }`}
              >
                 결제 요청하기
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
