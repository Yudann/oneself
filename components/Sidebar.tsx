"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '../lib/store-provider';
import { Page } from '../lib/types';
import { 
  Home, 
  Calendar, 
  Database, 
  Target, 
  Sparkles, 
  Settings,
  X,
  Sun,
  Moon,
  Plus,
  ChevronDown,
  ChevronRight,
  Trash2,
  LogOut,
  CheckCircle2
} from 'lucide-react';
import { ConfirmModal } from './ui/ConfirmModal';

const ICON_MAP: Record<string, any> = {
  'dashboard': Home,
  'habits': CheckCircle2,
  'calendar': Calendar,
  'database': Database,
  'focus': Target,
  'insights': Sparkles,
  'settings': Settings,
};

export const Sidebar: React.FC = () => {
  const { 
    state: { pages, sidebarOpen, userProfile, userPreferences }, 
    toggleSidebar, 
    addPrivatePage, 
    deletePage, 
    updateUserPreferences,
    logout
  } = useStore();
  
  const pathname = usePathname();
  const router = useRouter();
  const [expandedPages, setExpandedPages] = useState<Record<string, boolean>>({});
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'logout' | 'delete_page' | null;
    data?: any;
  }>({ isOpen: false, type: null });

  const toggleExpand = (id: string) => {
    setExpandedPages(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handlePageClick = (page: Page) => {
    if (window.innerWidth < 1024) toggleSidebar();
  };

  const handleConfirmAction = () => {
    if (modalConfig.type === 'logout') {
      logout();
    } else if (modalConfig.type === 'delete_page' && modalConfig.data) {
      deletePage(modalConfig.data);
      if (pathname.includes(modalConfig.data)) router.push('/');
    }
    setModalConfig({ ...modalConfig, isOpen: false });
  };

  const renderPageItem = (page: Page, depth = 0) => {
    const IconComponent = ICON_MAP[page.id] || Home;
    
    // Determine href
    const href = page.type === 'system' 
      ? (page.id === 'dashboard' ? '/' : `/${page.id}`) 
      : `/p/${page.id}`;
      
    const isActive = page.id === 'dashboard' 
      ? pathname === '/' 
      : pathname.startsWith(href);

    const subPages = pages.filter(p => p.parentId === page.id);
    const hasSubPages = subPages.length > 0;
    const isExpanded = expandedPages[page.id];

    return (
      <div key={page.id} className="w-full">
        <Link 
          href={href}
          onClick={() => handlePageClick(page)}
        >
          <div 
            className={`
              group flex items-center gap-1 py-1 rounded-xl transition-all cursor-pointer
              ${isActive 
                ? 'bg-zinc-200/80 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100' 
                : 'text-zinc-500 hover:bg-zinc-200/40 hover:text-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-200'}
            `}
            style={{ paddingLeft: `${depth * 12 + 4}px` }}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {page.type === 'private' ? (
                <button 
                  onClick={(e) => { 
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    toggleExpand(page.id); 
                  }}
                  className={`p-0.5 rounded hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors ${!hasSubPages && 'invisible'}`}
                >
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <div className="w-5 flex items-center justify-center">
                  <IconComponent size={16} className={isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400 dark:text-zinc-500'} />
                </div>
              )}
              
              {page.type === 'private' && <span className="text-sm shrink-0">{page.icon}</span>}
              <span className="text-sm font-semibold truncate flex-1">{page.title}</span>

              {page.type === 'private' && (
                <div className="hidden group-hover:flex items-center gap-1 pr-2">
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      addPrivatePage(page.id); 
                    }}
                    className="p-1 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400"
                  >
                    <Plus size={14} />
                  </button>
                  <button 
                    onClick={(e) => { 
                      e.preventDefault();
                      e.stopPropagation(); 
                      setModalConfig({
                        isOpen: true,
                        type: 'delete_page',
                        data: page.id
                      });
                    }}
                    className="p-1 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded text-zinc-400 hover:text-rose-600 dark:text-zinc-600 dark:hover:text-rose-400"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </Link>
        
        {isExpanded && hasSubPages && (
          <div className="mt-1">
            {subPages.map(p => renderPageItem(p, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  const systemPages = pages.filter(p => p.type === 'system');
  const topLevelPrivatePages = pages.filter(p => p.type === 'private' && !p.parentId);

  return (
    <>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-zinc-900/20 dark:bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-opacity animate-in fade-in"
          onClick={toggleSidebar}
        />
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-sidebar border-r border-border
        transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col p-6 shrink-0 transition-colors
      `}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg dark:bg-zinc-100 dark:text-zinc-900 transition-colors">O</div>
            <h1 className="font-bold text-lg text-zinc-800 tracking-tight dark:text-zinc-100 transition-colors">oneself</h1>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-400 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronRight className={`transition-transform duration-300 ${sidebarOpen ? 'rotate-180' : ''}`} size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-1">
          {/* System Section */}
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 mb-2 px-1 tracking-widest transition-colors">System</div>
            {systemPages.map(page => renderPageItem(page))}
          </div>

          {/* Mine Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-1 mb-2">
              <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 tracking-widest transition-colors">Mine</div>
              <button 
                onClick={() => addPrivatePage()}
                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            {topLevelPrivatePages.length > 0 ? (
              topLevelPrivatePages.map(page => renderPageItem(page))
            ) : (
              <div className="px-1 py-2 text-[11px] text-zinc-400 dark:text-zinc-600 italic transition-colors">No private pages yet.</div>
            )}
          </div>

          {/* Appearance Section */}
          <div className="pt-4 border-t border-border">
            <div className="text-[10px] uppercase font-bold text-zinc-400 dark:text-zinc-600 mb-4 px-1 tracking-widest transition-colors">Appearance</div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {[
                { id: 'light', icon: Sun, label: 'Light' },
                { id: 'dark', icon: Moon, label: 'Dark' }
              ].map((themeOption) => (
                <button
                  key={themeOption.id}
                  onClick={() => updateUserPreferences({ theme: themeOption.id as any })}
                  className={`
                    flex flex-col items-center justify-center py-2.5 rounded-xl transition-all gap-1 border
                    ${userPreferences.theme === themeOption.id 
                      ? 'bg-white border-zinc-200 text-zinc-900 shadow-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100' 
                      : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200/30 dark:text-zinc-500 dark:hover:bg-zinc-800/20 dark:hover:text-zinc-400'}
                  `}
                >
                  <themeOption.icon size={14} />
                  <span className="text-[9px] font-bold uppercase tracking-tighter">{themeOption.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* User Account Section */}
        <div className="mt-auto pt-6 border-t border-border flex items-center justify-between gap-2">
          <Link href="/settings" className="flex-1 min-w-0">
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 transition-colors cursor-pointer group">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md shrink-0 transition-transform group-hover:scale-105"
                style={{ backgroundColor: userProfile.avatarColor }}
              >
                {userProfile.name.charAt(0)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-zinc-800 truncate leading-none mb-1 dark:text-zinc-100 transition-colors">
                  {userProfile.name}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-600 truncate leading-none transition-colors">
                  {userProfile.email}
                </span>
              </div>
            </div>
          </Link>
          <button 
            onClick={() => {
              setModalConfig({
                isOpen: true,
                type: 'logout'
              });
            }}
            className="p-3 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-zinc-400 hover:text-rose-500 transition-all rounded-2xl"
            title="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <ConfirmModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={modalConfig.type === 'logout' ? 'Log Out' : 'Delete Page'}
        description={
          modalConfig.type === 'logout' 
            ? "Are you sure you want to log out? You will need to sign in again to access your data." 
            : "This page and all its contents will be permanently deleted. This action cannot be undone."
        }
        confirmLabel={modalConfig.type === 'logout' ? 'Log Out' : 'Delete'}
        variant="danger"
      />
    </>
  );
};
