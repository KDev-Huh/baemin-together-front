'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card } from '@/components/ui';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] pb-20">
      {/* Sticky Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${scrolled ? 'bg-white shadow-sm' : 'bg-[#2AC1BC]'} px-4 py-3`}>
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div className="flex items-center gap-1 cursor-pointer">
            <span className={`text-lg font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              우리집 주소 ▼
            </span>
          </div>
          <div className="flex gap-4">
             {/* Bell Icon */}
             <svg className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
             </svg>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto pt-16 px-4 space-y-4">
        
        {/* Search Bar */}
        <div className="relative shadow-sm">
          <input 
            type="text" 
            placeholder="찾는 맛집 이름이 뭐예요?"
            className="w-full h-12 rounded-[12px] pl-10 pr-4 text-sm bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] outline-none focus:ring-2 focus:ring-[#2AC1BC]"
          />
          <svg className="absolute left-3 top-3.5 w-5 h-5 text-[#2AC1BC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Big Cards Grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Card className="col-span-1 !p-4 bg-white flex flex-col items-center justify-center gap-2 aspect-square hover:bg-gray-50 cursor-pointer shadow-sm rounded-2xl">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              🛵
            </div>
            <span className="font-bold text-gray-800">배달</span>
          </Card>
          <Card className="col-span-1 !p-4 bg-white flex flex-col items-center justify-center gap-2 aspect-square hover:bg-gray-50 cursor-pointer shadow-sm rounded-2xl">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🛍️
            </div>
            <span className="font-bold text-gray-800">B마트</span>
          </Card>
          <Card className="col-span-1 !p-4 bg-white flex flex-col items-center justify-center gap-2 aspect-square hover:bg-gray-50 cursor-pointer shadow-sm rounded-2xl">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
              🎁
            </div>
            <span className="font-bold text-gray-800">선물하기</span>
          </Card>
        </div>

        {/* Quick Icon Grid */}
        <Card className="!p-5 rounded-2xl shadow-sm mt-4">
           <div className="grid grid-cols-4 gap-y-6">
              {[
                { name: '1인분', icon: '🍱' },
                { name: '족발·보쌈', icon: '🍖' },
                { name: '돈까스', icon: '🍛' },
                { name: '피자', icon: '🍕' },
                { name: '치킨', icon: '🍗' },
                { name: '분식', icon: '🍢' },
                { name: '카페·디저트', icon: '☕' },
                { name: '패스트푸드', icon: '🍔' },
              ].map((item) => (
                <div key={item.name} className="flex flex-col items-center gap-2 cursor-pointer hover:opacity-80">
                  <div className="text-3xl">{item.icon}</div>
                  <span className="text-xs font-medium text-gray-700">{item.name}</span>
                </div>
              ))}
           </div>
        </Card>

        {/* Banner Carousel (Static for now) */}
        <div className="h-40 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-sm mb-6">
           🎉 Dutch Bamin 런칭 이벤트!
        </div>
        
        {/* Auth Buttons if not logged in */}
        {!isAuthenticated && (
          <div className="mt-8 text-center space-y-4">
             <p className="text-gray-500 text-sm">더 많은 혜택을 누려보세요!</p>
             <div className="flex gap-3 justify-center">
                 <Link href="/auth/login" className="flex-1">
                   <Button variant="primary" className="w-full">로그인</Button>
                 </Link>
                 <Link href="/auth/signup" className="flex-1">
                   <Button variant="outline" className="w-full">회원가입</Button>
                 </Link>
             </div>
          </div>
        )}

      </main>

       {/* Bottom Navigation */}
       <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 px-6 pb-6 z-50">
          <div className="flex justify-between max-w-md mx-auto">
             <Link href="/" className="flex flex-col items-center gap-1 text-[#2AC1BC]">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                <span className="text-[10px] font-medium">홈</span>
             </Link>
             <Link href="/favorites" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <span className="text-[10px] font-medium">찜</span>
             </Link>
             <Link href="/orders" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                <span className="text-[10px] font-medium">주문내역</span>
             </Link>
             <Link href="/my" className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <span className="text-[10px] font-medium">my배민</span>
             </Link>
          </div>
       </nav>
    </div>
  );
}
