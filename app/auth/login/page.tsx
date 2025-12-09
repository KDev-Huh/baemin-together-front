'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { useAuth } from '@/lib/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/stores');
    } catch {
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Dutch Bamin
            </h1>
            <p className="mt-2 text-gray-600">
              함께 시켜서 더 저렴하게!
            </p>
        </div>

        <Card variant="elevated" className="overflow-hidden rounded-2xl">
          <CardHeader className="pt-8 pb-0">
            <CardTitle className="text-center text-xl font-bold">로그인</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <Input
                  label="이메일"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="bg-gray-50 border-0 focus:bg-white transition-colors"
                />

                <Input
                  label="비밀번호"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  className="bg-gray-50 border-0 focus:bg-white transition-colors"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full h-12 text-lg font-bold"
                isLoading={isLoading}
              >
                로그인
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>계정이 없으신가요?</span>
                <Link href="/auth/signup" className="text-[#2AC1BC] font-bold hover:underline">
                  회원가입
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
