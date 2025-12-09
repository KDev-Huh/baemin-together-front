'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { baeminApi } from '@/lib/api/baemin-api';
import { StoreDto } from '@/types/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { BottomNavigation } from '@/components/layout';
import { getStoreImage } from '@/lib/utils/image-helpers';

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites] = useLocalStorage<string[]>('favorites', []);
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStores() {
      try {
        const response = await baeminApi.getStores();
        setStores(response.stores);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStores();
  }, []);

  const favoriteStores = stores.filter((store) => favorites.includes(store.storeId));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex gap-3 items-center">
        <button onClick={() => router.back()} className="text-gray-800 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">찜한 가게</h1>
      </header>

      <main className="pb-20">
        {loading ? (
           <div className="flex justify-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AC1BC]"></div>
           </div>
        ) : favoriteStores.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-2xl">💔</div>
             <p className="text-lg font-medium text-gray-600">찜한 가게가 없어요</p>
             <p className="text-sm mt-2">자주 찾는 가게를 찜해보세요!</p>
             <button 
               onClick={() => router.push('/stores')}
               className="mt-6 px-6 py-2 bg-[#2AC1BC] text-white rounded-md text-sm font-bold"
             >
               가게 둘러보기
             </button>
           </div>
        ) : (
          <div className="divide-y divide-gray-100">
             {favoriteStores.map((store) => (
               <div 
                 key={store.storeId}
                 onClick={() => router.push(`/stores/${store.storeId}`)}
                 className="flex p-5 gap-4 bg-white hover:bg-gray-50 cursor-pointer"
               >
                  <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                     <Image
                       src={store.thumbnailUrl || getStoreImage(store.category, store.storeId)}
                       alt={store.storeName}
                       fill
                       className="object-cover"
                     />
                  </div>
                 <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate mb-1">{store.storeName}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-1">
                       <span className="text-yellow-400">★</span>
                       <span className="font-bold text-gray-900">{store.rating}</span>
                       <span>({store.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                       <span>{store.deliveryTime}</span>
                       <span>배달팁 {store.deliveryFee.toLocaleString()}원</span>
                    </div>
                 </div>
               </div>
             ))}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
