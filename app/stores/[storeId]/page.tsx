'use client';

import { useState, useCallback, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { baeminApi } from '@/lib/api/baemin-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { StoreDetailResponse, MenuDto } from '@/types/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function StoreDetailPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [store, setStore] = useState<StoreDetailResponse | null>(null);
  const [menus, setMenus] = useState<MenuDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'menu' | 'info' | 'reviews'>('menu');
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);
  
  const isFavorite = store && favorites.includes(store.storeId);
  const toggleFavorite = useCallback(() => {
    if (!store) return;
    if (isFavorite) {
      setFavorites(favorites.filter(id => id !== store.storeId));
    } else {
      setFavorites([...favorites, store.storeId]);
    }
  }, [store, isFavorite, favorites, setFavorites]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadStoreData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [storeData, menuData] = await Promise.all([
          baeminApi.getStoreDetail(resolvedParams.storeId),
          baeminApi.getMenus(resolvedParams.storeId),
        ]);

        setStore(storeData);
        setMenus(menuData.menus);
      } catch (err) {
        console.error('Failed to load store data:', err);
        setError('가게 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadStoreData();
  }, [isAuthenticated, resolvedParams.storeId, router]);

  const handleCreateRoom = async () => {
    if (!store || !user) return;

    try {
      const room = await baeminApi.createRoom({
        hostId: user.userId,
        storeId: store.storeId,
        storeName: store.storeName,
        deliveryFee: store.deliveryFee,
        minimumOrderAmount: store.minimumOrderAmount,
      });

      // alert('공구방이 생성되었습니다!');
      router.push(`/rooms/${room.roomId}`);
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('공구방 생성에 실패했습니다.');
    }
  };

  if (isLoading) {
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
          목록으로
        </button>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
        <p className="text-gray-600 mb-4">가게를 찾을 수 없습니다.</p>
        <button 
           onClick={() => router.push('/stores')}
           className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
        >
          목록으로
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 flex items-center h-14 px-4 transition-colors">
        <button onClick={() => router.back()} className="mr-4 text-gray-800">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h1 className="flex-1 font-bold text-lg text-gray-900 truncate pr-4">{store.storeName}</h1>
        <button className="text-gray-800" onClick={toggleFavorite}>
           <svg className={`w-6 h-6 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
           </svg>
        </button>
      </header>

      <main className="max-w-md mx-auto pt-14">
        {/* Store Info */}
        <div className="bg-white mb-3 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
           {store.thumbnailUrl && (
             <div className="w-full h-48 bg-gray-200">
                <img src={store.thumbnailUrl} alt={store.storeName} className="w-full h-full object-cover" />
             </div>
           )}
           <div className="p-5">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{store.storeName}</h2>
              <div className="flex items-center gap-1.5 text-sm mb-4">
                 <span className="text-yellow-400">★</span>
                 <span className="font-bold text-gray-900">{store.rating}</span>
                 <span className="text-gray-400 font-light">|</span>
                 <span className="text-gray-600">최근리뷰 {store.reviewCount}</span>
              </div>
              
              <div className="flex gap-8 text-sm text-gray-600 border-t border-gray-100 pt-4">
                 <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">배달팁</span>
                    <span className="font-medium text-gray-900">{store.deliveryFee.toLocaleString()}원</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">최소주문</span>
                    <span className="font-medium text-gray-900">{store.minimumOrderAmount.toLocaleString()}원</span>
                 </div>
                 <div className="flex flex-col gap-1">
                    <span className="text-gray-400 text-xs">배달시간</span>
                    <span className="font-medium text-gray-900">{store.deliveryTime}</span>
                 </div>
              </div>
              
              {store.notice && (
                 <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600 leading-relaxed">
                   <span className="font-bold text-gray-800 mr-1">📢 사장님 공지</span>
                   {store.notice}
                 </div>
              )}
           </div>
        </div>

        {/* Menu Tab */}
        <div className="bg-white mb-2 sticky top-14 z-40 border-b border-gray-100 flex text-center">
           <button 
             className={`flex-1 py-3 text-sm font-medium ${activeTab === 'menu' ? 'border-b-2 border-gray-900 text-gray-900 font-bold' : 'text-gray-400'}`}
             onClick={() => setActiveTab('menu')}
           >
             메뉴
           </button>
           <button 
             className={`flex-1 py-3 text-sm font-medium ${activeTab === 'info' ? 'border-b-2 border-gray-900 text-gray-900 font-bold' : 'text-gray-400'}`}
             onClick={() => setActiveTab('info')}
           >
             정보
           </button>
           <button 
             className={`flex-1 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'border-b-2 border-gray-900 text-gray-900 font-bold' : 'text-gray-400'}`}
             onClick={() => setActiveTab('reviews')}
           >
             리뷰 ({store.reviewCount})
           </button>
        </div>
        
        {/* Tab Content */}
        <div className="bg-white min-h-[500px]">
           {activeTab === 'info' ? (
             <div className="p-5 space-y-6">
                <div>
                   <h3 className="font-bold text-lg mb-2">가게 소개</h3>
                   <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                      {store.notice || '사장님 공지가 없습니다.'}
                   </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                   <h3 className="font-bold text-lg mb-4">가게 정보</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex">
                         <span className="w-24 text-gray-500">상호명</span>
                         <span className="text-gray-900">{store.storeName}</span>
                      </div>
                      <div className="flex">
                         <span className="w-24 text-gray-500">전화번호</span>
                         <span className="text-gray-900">050-1234-5678</span>
                      </div>
                      <div className="flex">
                         <span className="w-24 text-gray-500">주소</span>
                         <span className="text-gray-900">서울시 송파구 올림픽로 300</span>
                      </div>
                   </div>
                </div>
                
                <div className="border-t border-gray-100 pt-6">
                   <h3 className="font-bold text-lg mb-4">사업자 정보</h3>
                   <div className="space-y-3 text-sm">
                      <div className="flex">
                         <span className="w-24 text-gray-500">대표자명</span>
                         <span className="text-gray-900">홍길동</span>
                      </div>
                      <div className="flex">
                         <span className="w-24 text-gray-500">사업자등록번호</span>
                         <span className="text-gray-900">123-45-67890</span>
                      </div>
                   </div>
                </div>
             </div>
           ) : activeTab === 'reviews' ? (
             <div className="p-5">
                <div className="flex items-center gap-4 mb-6">
                   <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{store.rating}</div>
                      <div className="flex justify-center text-yellow-400 my-1">★★★★★</div>
                      <div className="text-xs text-gray-400">최근 리뷰 {store.reviewCount}개</div>
                   </div>
                   <div className="flex-1 bg-gray-50 p-4 rounded-lg text-sm text-gray-600">
                      맛있어요, 빨라요, 친절해요 등의<br/>긍정적인 리뷰가 많아요!
                   </div>
                </div>
                
                {/* Mock Reviews */}
                <div className="divide-y divide-gray-100">
                   {[1, 2, 3].map((i) => (
                      <div key={i} className="py-6 first:pt-0">
                         <div className="flex justify-between items-start mb-2">
                            <div>
                               <span className="font-bold text-gray-900 mr-2">맛있는게좋아</span>
                               <span className="text-xs text-gray-400">어제</span>
                            </div>
                            <div className="flex text-yellow-400 text-sm">★★★★★</div>
                         </div>
                         <div className="w-full aspect-video bg-gray-100 rounded-lg mb-3"></div>
                         <p className="text-sm text-gray-800 leading-relaxed">
                            정말 맛있어요! 배달도 빠르고 사장님도 친절하십니다.
                            다음에 또 주문할게요~
                         </p>
                      </div>
                   ))}
                </div>
             </div>
           ) : menus.length === 0 ? (
              <div className="py-20 text-center text-gray-400">메뉴가 없습니다.</div>
           ) : (
             <div className="divide-y divide-gray-100">
               {menus.map((menu) => (
                 <div key={menu.menuId} className={`p-4 flex justify-between gap-4 ${!menu.isAvailable ? 'opacity-50' : ''}`}>
                    <div className="flex-1">
                       <h3 className="text-base font-bold text-gray-900 mb-1">{menu.menuName}</h3>
                       <p className="text-sm text-gray-500 mb-2 line-clamp-2">{menu.description}</p>
                       <p className="text-sm font-bold text-gray-900">{menu.price.toLocaleString()}원</p>
                       {!menu.isAvailable && <span className="text-xs text-red-500 font-bold mt-1 inline-block">품절</span>}
                       {menu.isPopular && <span className="text-xs text-[#2AC1BC] border border-[#2AC1BC] px-1 rounded ml-2">인기</span>}
                    </div>
                    {menu.imageUrl && (
                       <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img src={menu.imageUrl} alt={menu.menuName} className="w-full h-full object-cover" />
                       </div>
                    )}
                 </div>
               ))}
             </div>
           )}
        </div>
      </main>

      {/* Floating Bottom Button */}
      {store.isOpen && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-transparent from-white/0 to-white pt-10 bg-gradient-to-t pointer-events-none flex justify-center z-50">
           <div className="pointer-events-auto w-full max-w-md">
              <button
                onClick={handleCreateRoom}
                className="w-full py-4 bg-[#2AC1BC] hover:bg-[#25B5B0] active:scale-[0.98] transition-all text-white font-bold text-lg rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                 <span>배달비 n빵 / 공동 주문하기</span>
              </button>
           </div>
        </div>
      )}
    </div>
  );
}
