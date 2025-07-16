'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { RootState } from '@/redux/store';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user?._id) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading || !user?._id) {
    return <div className="p-6">Loading...</div>; // or a spinner
  }

  return <>{children}</>;
}
