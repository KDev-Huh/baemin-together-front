'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { baeminApi } from '@/lib/api/baemin-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import type { StoreDto } from '@/types/api';

export default function StoresPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [category, setCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    const loadStores = async () => {
      setIsLoading(true);
      try {
        const response = await baeminApi.getStores({
          category: category === '전체' ? undefined : category,
          sortBy,
        });
        setStores(response.stores);
      } catch (error) {
        console.error('Failed to load stores:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStores();
  }, [isAuthenticated, category, sortBy, router]);

  const categories = ['전체', '한식', '중식', '일식', '양식', '치킨', '피자', '분식', '카페'];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 h-14 flex items-center justify-center">
        <h1 className="text-lg font-bold text-gray-900">골라먹는 재미</h1>
      </header>

      <main className="max-w-md mx-auto pt-14">
        {/* Category Filters */}
        <div className="bg-white sticky top-14 z-40 py-3 px-4 border-b border-gray-100 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  category === cat
                    ? 'bg-[#2AC1BC] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="px-4 py-3 flex items-center justify-end gap-2 text-xs text-gray-500 bg-white border-b border-gray-100">
             <button onClick={() => setSortBy('rating')} className={sortBy === 'rating' ? 'font-bold text-gray-800' : ''}>별점순</button>
             <span>|</span>
             <button onClick={() => setSortBy('review')} className={sortBy === 'review' ? 'font-bold text-gray-800' : ''}>리뷰많은순</button>
             <span>|</span>
             <button onClick={() => setSortBy('delivery')} className={sortBy === 'delivery' ? 'font-bold text-gray-800' : ''}>배달비낮은순</button>
        </div>

        {/* Store List */}
        <div className="bg-white">
        {isLoading ? (
          <div className="py-20 text-center">
             <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AC1BC]"></div>
          </div>
        ) : stores.length === 0 ? (
           <div className="py-20 text-center text-gray-500">
             가게가 없습니다.
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {stores.map((store) => (
              <div
                key={store.storeId}
                className="p-4 flex gap-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => router.push(`/stores/${store.storeId}`)}
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative">
                   {store.thumbnailUrl ? (
                      <img src={store.thumbnailUrl} alt={store.storeName} className="w-full h-full object-cover" />
                   ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-300">No Image</div>
                   )}
                   {!store.isOpen && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold">
                        영업준비중
                     </div>
                   )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-1">{store.storeName}</h3>
                  
                  <div className="flex items-center gap-1 text-sm mb-2">
                    <span className="text-yellow-400">★</span>
                    <span className="font-bold text-gray-800">{store.rating}</span>
                    <span className="text-gray-500">({store.reviewCount})</span>
                  </div>

                  <div className="flex flex-col gap-1 text-sm text-gray-600">
                     <div className="flex items-center gap-1">
                        <span>{store.deliveryTime}</span>
                        <span className="text-gray-300">·</span>
                        <span>배달팁 {store.deliveryFee.toLocaleString()}원</span>
                     </div>
                     <span className="text-xs text-gray-500">최소주문 {store.minimumOrderAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>
      </main>
      
       {/* Bottom Navigation (Replicated from Home) */}
       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 pb-6 z-50">
          <div className="flex justify-between max-w-md mx-auto">
             <div className="flex flex-col items-center gap-1 text-gray-400" onClick={() => router.push('/')}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                <span className="text-[10px] font-medium">홈</span>
             </div>
              <div className="flex flex-col items-center gap-1 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-[10px] font-medium">찜</span>
             </div>
             <div className="flex flex-col items-center gap-1 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <span className="text-[10px] font-medium">주문내역</span>
             </div>
             <div className="flex flex-col items-center gap-1 text-gray-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="text-[10px] font-medium">my배민</span>
             </div>
          </div>
       </nav>
    </div>
  );
}
