'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { baeminApi } from '@/lib/api/baemin-api';
import { useAuth } from '@/lib/contexts/AuthContext';
import { BottomNavigation } from '@/components/layout';
import { getStoreImage } from '@/lib/utils/image-helpers';
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
                     <Image 
                       src={getStoreImage(category === '전체' ? undefined : category, store.storeId)} 
                       alt={store.storeName} 
                       fill
                       className="object-cover"
                     />
                     {!store.isOpen && (
                       <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs font-bold z-10">
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
      
       {/* Bottom Navigation */}
       <BottomNavigation />
    </div>
  );
}
