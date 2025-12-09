'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { baeminApi } from '@/lib/api/baemin-api';
import { StoreDto } from '@/types/api';
import { Input } from '@/components/ui';

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [stores, setStores] = useState<StoreDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]); // In a real app, from localStorage

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

  const filteredStores = query
    ? stores.filter((store) =>
        store.storeName.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Search Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex gap-3 items-center">
        <button onClick={() => router.back()} className="text-gray-800 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 relative">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="먹고 싶은 메뉴, 가게 검색"
            className="w-full bg-gray-50 border-none rounded-md !py-2.5 !px-3"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 bg-gray-200 rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ✕
            </button>
          )}
        </div>
        <button className="text-gray-600 text-sm font-medium shrink-0">검색</button>
      </header>

      <main className="pb-20">
        {!query ? (
          /* Empty State / Recent Searches */
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900">최근 검색어</h3>
              <button 
                className="text-xs text-gray-400"
                onClick={() => setRecentSearches([])}
              >
                전체삭제
              </button>
            </div>
            {recentSearches.length > 0 ? (
               <div className="flex flex-wrap gap-2">
                 {recentSearches.map((term, i) => (
                   <span key={i} className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                     {term}
                   </span>
                 ))}
               </div>
            ) : (
              <div className="text-center py-10 text-gray-400 text-sm">
                최근 검색어가 없습니다.
              </div>
            )}
            
            {/* Recommendations (Mock) */}
            <div className="mt-8">
               <h3 className="text-sm font-bold text-gray-900 mb-4">추천 검색어</h3>
               <div className="flex flex-wrap gap-2">
                 {['마라탕', '치킨', '피자', '족발', '디저트', '커피'].map((term) => (
                   <button 
                     key={term}
                     onClick={() => setQuery(term)}
                     className="px-4 py-2 bg-blue-50 text-[#2AC1BC] rounded-full text-sm font-medium"
                   >
                     {term}
                   </button>
                 ))}
               </div>
            </div>
          </div>
        ) : (
          /* Search Results */
          <div>
            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AC1BC]"></div>
              </div>
            ) : filteredStores.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">검색 결과가 없습니다.</p>
                <p className="text-sm mt-2 text-gray-400">다른 검색어로 찾아보세요!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredStores.map((store) => (
                  <div 
                    key={store.storeId}
                    onClick={() => router.push(`/stores/${store.storeId}`)}
                    className="flex p-5 gap-4 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    {store.thumbnailUrl && (
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                         <img src={store.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
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
          </div>
        )}
      </main>
    </div>
  );
}
