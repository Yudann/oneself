"use client";

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store-provider';
import { Sidebar } from '@/components/Sidebar';
import { PageWrapper } from '@/components/PageWrapper';
import { QuickAdd } from '@/components/QuickAdd';
import { ChevronRight } from 'lucide-react';

export const AppContent = ({ children }: { children: React.ReactNode }) => {
  const { state: { isAuthenticated, sidebarOpen }, isLoaded, toggleSidebar } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      if (!isAuthenticated && pathname !== '/auth') {
        router.push('/auth');
      }
    }
  }, [isAuthenticated, isLoaded, pathname, router]);

  // If we are on the auth page, we just render the children without sidebar/quickadd
  if (pathname === '/auth') {
    return <>{children}</>;
  }

  // While loading state from localStorage, show a simple loader to prevent flashing the dashboard
  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-app">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl flex items-center justify-center text-xl font-bold animate-pulse">O</div>
          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-zinc-400 animate-pulse">Entering oneself...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on auth page (and isLoaded is true), we will be redirected by useEffect
  // But to be safe and avoid layout shift, we return null or a loader
  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="flex w-full min-h-screen bg-app transition-colors">
      <Sidebar />
      <main className={`flex-1 h-screen overflow-y-auto relative custom-scrollbar transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : 'lg:pl-0'}`}>
        {!sidebarOpen && (
          <button 
            onClick={toggleSidebar}
            className="fixed top-6 left-6 z-[80] p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 shadow-xl transition-all hover:scale-110 active:scale-95 hidden lg:flex"
          >
            <ChevronRight size={20} />
          </button>
        )}
        <PageWrapper>{children}</PageWrapper>
      </main>
      <QuickAdd />
    </div>
  );
};
