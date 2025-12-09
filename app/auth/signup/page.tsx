'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { baeminApi } from '@/lib/api/baemin-api';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    phoneNumber: '',
    roadAddress: '',
    detailAddress: '',
    zipCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 비밀번호 유효성 검사
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('비밀번호는 8자 이상이며, 영문과 숫자를 포함해야 합니다.');
      return;
    }

    // 전화번호 형식 검사
    const phoneRegex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError('전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)');
      return;
    }

    setIsLoading(true);

    try {
      await baeminApi.signup({
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        phoneNumber: formData.phoneNumber,
        roadAddress: formData.roadAddress,
        detailAddress: formData.detailAddress,
        zipCode: formData.zipCode,
      });

      alert('회원가입이 완료되었습니다! 로그인해주세요.');
      router.push('/auth/login');
    } catch {
      setError('회원가입에 실패했습니다. 입력 정보를 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center">
             <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
               회원가입
             </h1>
             <p className="mt-2 text-gray-600">
               배민투게더의 가족이 되어주세요!
             </p>
         </div>

        <Card variant="elevated" className="overflow-hidden rounded-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-gray-800 border-b pb-2">기본 정보</h3>
                 <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="이메일"
                    type="email"
                    value={formData.email}
                    onChange={handleChange('email')}
                    placeholder="example@email.com"
                    required
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />

                  <Input
                    label="닉네임"
                    type="text"
                    value={formData.nickname}
                    onChange={handleChange('nickname')}
                    placeholder="닉네임"
                    required
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="비밀번호"
                    type="password"
                    value={formData.password}
                    onChange={handleChange('password')}
                    placeholder="8자 이상, 영문+숫자"
                    required
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />

                  <Input
                    label="비밀번호 확인"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    placeholder="비밀번호 재입력"
                    required
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                 <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mt-6">연락처 및 주소</h3>
                 <Input
                    label="전화번호"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleChange('phoneNumber')}
                    placeholder="010-1234-5678"
                    helperText="하이픈(-)을 포함해서 입력"
                    required
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="도로명 주소"
                      type="text"
                      value={formData.roadAddress}
                      onChange={handleChange('roadAddress')}
                      placeholder="서울시 강남구 테헤란로 123"
                      required
                      className="bg-gray-50 border-0 focus:bg-white transition-colors"
                    />

                    <Input
                      label="상세 주소"
                      type="text"
                      value={formData.detailAddress}
                      onChange={handleChange('detailAddress')}
                      placeholder="101호"
                      className="bg-gray-50 border-0 focus:bg-white transition-colors"
                    />
                  </div>

                  <Input
                    label="우편번호"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange('zipCode')}
                    placeholder="12345"
                    className="bg-gray-50 border-0 focus:bg-white transition-colors"
                  />
              </div>

              <div className="pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    className="w-full h-12 text-lg font-bold"
                    isLoading={isLoading}
                >
                    가입하기
                </Button>
              </div>

              <div className="text-center text-sm text-gray-600">
                이미 계정이 있으신가요?{' '}
                <Link href="/auth/login" className="text-[#2AC1BC] font-bold hover:underline">
                  로그인
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
