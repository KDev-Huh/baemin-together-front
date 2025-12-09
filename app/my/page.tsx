'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/contexts/AuthContext';
import { Button } from '@/components/ui';

export default function MyPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    alert('로그아웃 되었습니다.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 p-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-gray-900">my배민</h1>
        <button className="text-gray-400">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
        </button>
      </header>

      {/* User Info Section */}
      <div className="bg-white mb-3">
        {isAuthenticated && user ? (
          <div className="p-5 flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden">
                <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.email}`} alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                   {user.nickname}
                   <span className="text-[10px] bg-[#2AC1BC] text-white px-1.5 py-0.5 rounded-sm">고마운분</span>
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
             </div>
             <button className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
             </button>
          </div>
        ) : (
          <div className="p-8 text-center" onClick={() => router.push('/auth/login')}>
             <p className="text-xl font-bold text-gray-900 mb-2">로그인해주세요</p>
             <p className="text-sm text-gray-500 mb-4">배민투게더의 다양한 혜택을 누려보세요</p>
             <Button className="w-full max-w-xs mx-auto">로그인 하러가기</Button>
          </div>
        )}
      </div>

      {/* Quick Menu */}
      <div className="bg-white mb-3 p-4">
         <div className="flex justify-around text-center">
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-2xl">🎟️</div>
               <span className="text-xs font-medium text-gray-700">쿠폰함</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-2xl">💰</div>
               <span className="text-xs font-medium text-gray-700">포인트</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center text-2xl">💝</div>
               <span className="text-xs font-medium text-gray-700">선물함</span>
            </div>
            <div className="flex flex-col items-center gap-2">
               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">❤️</div>
               <span className="text-xs font-medium text-gray-700">찜</span>
            </div>
         </div>
      </div>

      {/* Menu List */}
      <div className="bg-white mb-3">
         <div className="flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-900">공지사항</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </div>
         <div className="flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-900">이벤트</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </div>
         <div className="flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-900">고객센터</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </div>
         <div className="flex items-center justify-between p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-900">약관 및 정책</span>
            <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
         </div>
         <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
            <span className="font-medium text-gray-900">버전 정보</span>
            <span className="text-sm text-gray-400">1.0.0</span>
         </div>
      </div>

      {/* Logout */}
      {isAuthenticated && (
         <div className="p-4">
             <button 
               onClick={handleLogout}
               className="w-full py-3 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
             >
               로그아웃
             </button>
         </div>
      )}
    </div>
  );
}
