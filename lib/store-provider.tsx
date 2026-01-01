"use client";

import React, { createContext, useContext, ReactNode, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from './store'; 
import { useUser, useSignOut } from './hooks/use-auth';
import * as api from './api';
import { AppState, Page, Activity, UserProfile, UserPreferences, EngineSettings, FocusItem, Block, BlockType } from './types';
import { INITIAL_PAGES } from './constants';

// Define the shape of the context (same as store)
type StoreContextType = ReturnType<typeof useAppStore>;

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading: isAuthLoading } = useUser();
  const signOut = useSignOut();
  const uiStore = useAppStore();
  const queryClient = useQueryClient();
  
  // Track last local update to prevent "clobbering" by incoming server data while typing
  const lastLocalUpdate = useRef<number>(0);

  // Queries
  const { data: profile } = useQuery({ queryKey: ['profile', user?.id], queryFn: () => api.getProfile(user!.id), enabled: !!user });
  const { data: activities } = useQuery({ queryKey: ['activities', user?.id], queryFn: api.getActivities, enabled: !!user });
  const { data: pages } = useQuery({ queryKey: ['pages', user?.id], queryFn: api.getPages, enabled: !!user });
  const { data: focusItems } = useQuery({ queryKey: ['focusItems', user?.id], queryFn: api.getFocusItems, enabled: !!user });

  // Sync Data Down (Debounced/Throttled by user activity)
  useEffect(() => {
    // If user typed recently (< 2s), don't overwrite local state with potentially stale/racing server data
    if (Date.now() - lastLocalUpdate.current < 2000) return;

    const newData: Partial<AppState> = {};
    let hasChanges = false;

    // Only import if meaningful valid data exists
    if (profile && JSON.stringify(profile) !== JSON.stringify(uiStore.state.userProfile)) {
      newData.userProfile = profile;
      hasChanges = true;
    }
    if (activities && JSON.stringify(activities) !== JSON.stringify(uiStore.state.activities)) {
      newData.activities = activities;
      hasChanges = true;
    }
    if (pages) {
        // Need to merge fetch pages with system pages which are static
        // Assuming INITIAL_PAGES are system pages and we prepend them
        // Check if different to avoid loop
        const currentDbPages = uiStore.state.pages.filter(p => p.type !== 'system');
        if (JSON.stringify(pages) !== JSON.stringify(currentDbPages)) {
            // Note: This logic assumes INITIAL_PAGES are static and always the same.
            newData.pages = [...INITIAL_PAGES, ...pages];
            hasChanges = true;
        }
    }
    if (focusItems && JSON.stringify(focusItems) !== JSON.stringify(uiStore.state.focusItems)) {
      newData.focusItems = focusItems;
      hasChanges = true;
    }

    if (hasChanges) {
       uiStore.importData(newData);
    }
  }, [profile, activities, pages, focusItems, uiStore]);


  // Mutations with Toasts
  const createActivityMutation = useMutation({ 
    mutationFn: api.createActivity, 
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['activities'] });
        toast.success('Activity created');
    },
    onError: () => toast.error('Failed to create activity')
  });
  
  const updateActivityMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Activity>}) => api.updateActivity(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['activities'] }),
      onError: () => toast.error('Failed to update activity')
  });

  const deleteActivityMutation = useMutation({ 
      mutationFn: api.deleteActivity, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['activities'] });
          toast.success('Activity deleted');
      },
      onError: () => toast.error('Failed to delete activity')
  });

  const createPageMutation = useMutation({ 
      mutationFn: api.createPage, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pages'] });
          toast.success('Page created');
      },
      onError: () => toast.error('Failed to create page')
  });

  const updatePageMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Page>}) => api.updatePage(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
      onError: () => toast.error('Failed to update page')
  });

  const deletePageMutation = useMutation({ 
      mutationFn: api.deletePage, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['pages'] });
          toast.success('Page deleted');
      },
      onError: () => toast.error('Failed to delete page')
  });

  const createBlockMutation = useMutation({ 
      mutationFn: (vars: {pageId: string, block: Block}) => api.createBlock(vars.pageId, vars.block), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
      onError: () => toast.error('Failed to add block')
  });

  const updateBlockMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Block>}) => api.updateBlock(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
      onError: () => toast.error('Failed to update block')
  });

  const deleteBlockMutation = useMutation({ 
      mutationFn: api.deleteBlock, 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages'] }),
      onError: () => toast.error('Failed to delete block')
  });

  const createFocusItemMutation = useMutation({ 
      mutationFn: api.createFocusItem, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['focusItems'] });
          toast.success('Focus item added');
      },
      onError: () => toast.error('Failed to add focus item')
  });

  const updateFocusItemMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<FocusItem>}) => api.updateFocusItem(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['focusItems'] }),
      onError: () => toast.error('Failed to update focus item')
  });

  const deleteFocusItemMutation = useMutation({ 
      mutationFn: api.deleteFocusItem, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['focusItems'] });
      },
      onError: () => toast.error('Failed to remove focus item')
  });

  const contextValue: StoreContextType = useMemo(() => {
    const markLocalUpdate = () => { lastLocalUpdate.current = Date.now(); };

    return {
      // Source of Truth is now LOCAL State, populated/synced from Server
      state: {
          ...uiStore.state,
           isAuthenticated: !!user,
      },
      isLoaded: !isAuthLoading && uiStore.isLoaded,
      
      setPage: uiStore.setPage,
      toggleSidebar: uiStore.toggleSidebar,
      
      addPrivatePage: (parentId) => {
         markLocalUpdate();
         const newPage: Page = {
          id: crypto.randomUUID(), 
          title: 'New Page',
          icon: '📄',
          type: 'private',
          parentId,
          blocks: []
         };
         // We manually update local state to ensure it shows up instantly
         uiStore.importData({ pages: [...uiStore.state.pages, newPage] });
         createPageMutation.mutate(newPage);
      },

      updatePage: (id, updates) => {
          markLocalUpdate();
          uiStore.updatePage(id, updates);
          updatePageMutation.mutate({ id, updates });
      },
      deletePage: (id) => {
          markLocalUpdate();
          uiStore.deletePage(id);
          deletePageMutation.mutate(id);
      },
      
      addBlockToPage: (pageId, type, config) => {
          markLocalUpdate();
          const blockId = crypto.randomUUID();
          // Optimistic Update
          const currentPages = uiStore.state.pages;
          const updatedPages = currentPages.map(p => {
              if (p.id !== pageId) return p;
              return {
                  ...p,
                  blocks: [...p.blocks, { id: blockId, type, content: '', config }]
              };
          });
          uiStore.importData({ pages: updatedPages });
          
          createBlockMutation.mutate({ pageId, block: { id: blockId, type, content: '', config } as any });
      },
      updateBlock: (pageId, blockId, updates) => {
          markLocalUpdate();
          uiStore.updateBlock(pageId, blockId, updates);
          updateBlockMutation.mutate({ id: blockId, updates });
      },
      deleteBlock: (pageId, blockId) => {
          markLocalUpdate();
          uiStore.deleteBlock(pageId, blockId);
          deleteBlockMutation.mutate(blockId);
      },

      addActivity: (activity) => {
          markLocalUpdate();
          const newAct = { ...activity, id: crypto.randomUUID() };
          uiStore.importData({ activities: [newAct, ...uiStore.state.activities] });
          createActivityMutation.mutate(newAct);
          return newAct;
      },
      updateActivity: (id, updates) => {
          markLocalUpdate();
          uiStore.updateActivity(id, updates);
          updateActivityMutation.mutate({ id, updates });
      },
      deleteActivity: (id) => {
          markLocalUpdate();
          uiStore.deleteActivity(id);
          deleteActivityMutation.mutate(id);
      },

      updateUserProfile: (updates) => {
          markLocalUpdate();
          uiStore.updateUserProfile(updates);
          if (user) api.updateProfile(user.id, updates).then(() => queryClient.invalidateQueries({ queryKey: ['profile'] }));
      },
      updateUserPreferences: uiStore.updateUserPreferences,
      updateEngineSettings: uiStore.updateEngineSettings,
      
      setFocusItem: (item) => {
          markLocalUpdate();
          uiStore.setFocusItem(item); // Optimistic via store logic (which handles insert/update)
          
          const existing = focusItems?.find(f => f.activityId === item.activityId && f.date === item.date);
          if (existing) {
             updateFocusItemMutation.mutate({ id: existing.id, updates: { column: item.column } });
          } else {
             createFocusItemMutation.mutate({
                 ...item,
                 id: crypto.randomUUID(),
                 completed: false
             });
          }
      },
      moveFocusItem: (id, column) => {
          markLocalUpdate();
          uiStore.moveFocusItem(id, column);
          updateFocusItemMutation.mutate({ id, updates: { column } });
      },
      toggleFocusItemCompletion: (id) => {
        markLocalUpdate();
        uiStore.toggleFocusItemCompletion(id);
        const item = focusItems?.find(i => i.id === id);
        if (item) updateFocusItemMutation.mutate({ id, updates: { completed: !item.completed } });
      },
      removeFocusItem: (id) => {
          markLocalUpdate();
          uiStore.removeFocusItem(id);
          deleteFocusItemMutation.mutate(id);
      },

      importData: uiStore.importData,
      login: (email, name) => {}, // Handled by Supabase
      logout: () => signOut.mutate(),
    };
  }, [
    user, profile, activities, pages, focusItems, isAuthLoading, uiStore.state,
    createActivityMutation, updateActivityMutation, deleteActivityMutation,
    createPageMutation, updatePageMutation, deletePageMutation,
    createBlockMutation, updateBlockMutation, deleteBlockMutation,
    createFocusItemMutation, updateFocusItemMutation, deleteFocusItemMutation,
    uiStore
  ]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
