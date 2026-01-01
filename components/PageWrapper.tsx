"use client";

import React, { useEffect } from 'react';
import { useStore } from '@/lib/store-provider';
import { Menu } from 'lucide-react';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const { state: { sidebarOpen, userPreferences }, toggleSidebar } = useStore();

  useEffect(() => {
    const root = document.documentElement;
    if (userPreferences.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [userPreferences.theme]);

  // When sidebar is closed, we need to add padding to the top on mobile so the floating button doesn't overlap text
  return (
    <div className={`h-full transition-all duration-300 ${!sidebarOpen ? 'pt-20 lg:pt-0' : ''}`}>
      {!sidebarOpen && (
        <button 
          onClick={toggleSidebar} 
          className="lg:hidden fixed top-4 left-4 p-3 rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-xl border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 z-[100] hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
        >
          <Menu size={22} />
        </button>
      )}
      
      {!sidebarOpen && (
        <button 
          onClick={toggleSidebar} 
          className="hidden lg:flex fixed top-6 left-6 p-2 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 text-zinc-400 dark:text-zinc-600 z-50 transition-colors"
          title="Open Sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      <div>
        {children}
      </div>
    </div>
  );
};
