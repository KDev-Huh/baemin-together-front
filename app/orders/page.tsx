'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { baeminApi } from '@/lib/api/baemin-api';
import { RoomDetailResponse } from '@/types/api';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function OrdersPage() {
  const router = useRouter();
  const [recentRooms] = useLocalStorage<string[]>('recentRooms', []);
  const [rooms, setRooms] = useState<RoomDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      if (recentRooms.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const roomPromises = recentRooms.map(id => 
          baeminApi.getRoomDetail(id).catch(() => null)
        );
        const results = await Promise.all(roomPromises);
        // Filter out nulls (deleted rooms or errors)
        setRooms(results.filter((r): r is RoomDetailResponse => r !== null));
      } catch (error) {
        console.error('Failed to fetch room history:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchRooms();
  }, [recentRooms]);

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex gap-3 items-center">
        <button onClick={() => router.back()} className="text-gray-800 shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">주문내역</h1>
      </header>

      <main className="pb-20 bg-gray-50 min-h-screen">
        {loading ? (
           <div className="flex justify-center py-10">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2AC1BC]"></div>
           </div>
        ) : rooms.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-2xl">🧾</div>
             <p className="text-lg font-medium text-gray-600">주문 내역이 없어요</p>
           </div>
        ) : (
          <div className="space-y-3 p-4">
             {rooms.map((room) => (
               <div 
                 key={room.roomId}
                 onClick={() => router.push(`/rooms/${room.roomId}`)}
                 className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
               >
                 <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{room.storeName}</h3>
                      <p className="text-xs text-gray-500">배달팁 {room.deliveryFee.toLocaleString()}원</p>
                    </div>
                    <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                      모집중
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    <span className="font-medium text-gray-900">함께 주문하기</span>
                    <span className="text-gray-400">|</span>
                    <span>참여자 {room.participants.length}명</span>
                 </div>
               </div>
             ))}
          </div>
        )}
      </main>
    </div>
  );
}
