'use client';

import { useStore } from '../lib/store-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { state: { isAuthenticated }, isLoaded } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoaded, isAuthenticated, router]);

  if (!isLoaded || !isAuthenticated) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
};
