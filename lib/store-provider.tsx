"use client";

import React, { createContext, useContext, ReactNode, useEffect, useMemo, useRef } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from './store'; 
import { useUser, useSignOut } from './hooks/use-auth';
import * as api from './api';
import { AppState, Page, Activity, UserProfile, UserPreferences, EngineSettings, FocusItem, Block, BlockType, Habit, HabitLog, Transaction, Subscription } from './types';
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

  // Queries with Stale Time to prevent excessive fetching
  const { data: profile } = useQuery({ queryKey: ['profile', user?.id], queryFn: () => api.getProfile(user!.id), enabled: !!user, staleTime: 300000 });
  const { data: activities } = useQuery({ queryKey: ['activities', user?.id], queryFn: api.getActivities, enabled: !!user, staleTime: 300000 });
  const { data: pages } = useQuery({ queryKey: ['pages', user?.id], queryFn: api.getPages, enabled: !!user, staleTime: 300000 });
  const { data: focusItems } = useQuery({ queryKey: ['focusItems', user?.id], queryFn: api.getFocusItems, enabled: !!user, staleTime: 300000 });
  const { data: habits } = useQuery({ queryKey: ['habits', user?.id], queryFn: api.getHabits, enabled: !!user, staleTime: 300000 });
  const { data: habitLogs } = useQuery({ queryKey: ['habitLogs', user?.id], queryFn: api.getHabitLogs, enabled: !!user, staleTime: 300000 });
  const { data: transactions } = useQuery({ queryKey: ['transactions', user?.id], queryFn: api.getTransactions, enabled: !!user, staleTime: 300000 });
  const { data: subscriptions } = useQuery({ queryKey: ['subscriptions', user?.id], queryFn: api.getSubscriptions, enabled: !!user, staleTime: 300000 });
  const { data: thoughts } = useQuery({ queryKey: ['thoughts', user?.id], queryFn: api.getThoughts, enabled: !!user, staleTime: 300000 });

  // Sync Auth State
  useEffect(() => {
    if (user && !uiStore.state.isAuthenticated) {
        uiStore.login(user.email || '', user.user_metadata?.name || 'User');
    } else if (!user && !isAuthLoading && uiStore.state.isAuthenticated) {
        // Only logout if we are sure there is no user and loading is done
        uiStore.logout();
    }
  }, [user, isAuthLoading, uiStore.state.isAuthenticated, uiStore.login, uiStore.logout]);

  // Sync Data Down (Debounced/Throttled by user activity)
  useEffect(() => {
    // If user typed recently (< 2s), don't overwrite local state with potentially stale/racing server data
    if (Date.now() - lastLocalUpdate.current < 2000) return;

    const newData: Partial<AppState> = {};
    let hasChanges = false;

    // Helper to compare
    const isDiff = (a: any, b: any) => JSON.stringify(a) !== JSON.stringify(b);

    // Only import if meaningful valid data exists and is different from current state
    if (profile && isDiff(profile, uiStore.state.userProfile)) {
      newData.userProfile = profile;
      hasChanges = true;
    }
    if (activities && isDiff(activities, uiStore.state.activities)) {
      newData.activities = activities;
      hasChanges = true;
    }
    if (pages) {
        const fetchedPrivatePages = pages.filter(p => p.type !== 'system');
        const currentPrivatePages = uiStore.state.pages.filter(p => p.type !== 'system');
        const currentSystemPages = uiStore.state.pages.filter(p => p.type === 'system');

        const systemChanged = isDiff(currentSystemPages, INITIAL_PAGES);
        const privateChanged = isDiff(fetchedPrivatePages, currentPrivatePages);

        if (systemChanged || privateChanged) {
            // We preserve system pages from INITIAL_PAGES but might want to preserve state? 
            // Actually INITIAL_PAGES are static.
            newData.pages = [...INITIAL_PAGES, ...fetchedPrivatePages];
            hasChanges = true;
        }
    }
    if (focusItems && isDiff(focusItems, uiStore.state.focusItems)) {
      newData.focusItems = focusItems;
      hasChanges = true;
    }
    if (habits && isDiff(habits, uiStore.state.habits)) {
        newData.habits = habits;
        hasChanges = true;
    }
    if (habitLogs && isDiff(habitLogs, uiStore.state.habitLogs)) {
        newData.habitLogs = habitLogs;
        hasChanges = true;
    }
    if (transactions && isDiff(transactions, uiStore.state.transactions)) {
        newData.transactions = transactions;
        hasChanges = true;
    }
    if (subscriptions && isDiff(subscriptions, uiStore.state.subscriptions)) {
        newData.subscriptions = subscriptions;
        hasChanges = true;
    }
    if (thoughts && isDiff(thoughts, uiStore.state.thoughts)) {
        newData.thoughts = thoughts;
        hasChanges = true;
    }

    if (hasChanges) {
       uiStore.importData(newData);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, activities, pages, focusItems, habits, habitLogs, transactions, subscriptions, thoughts]); 
  // Removed uiStore from deps to prevent loop. We only want to sync when FETCHED data changes.


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

  const createHabitMutation = useMutation({ 
      mutationFn: api.createHabit, 
      onSuccess: () => { 
          queryClient.invalidateQueries({ queryKey: ['habits'] });
          toast.success('Habit started');
      }, 
      onError: () => toast.error('Failed to create habit') 
  });
  const updateHabitMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Habit>}) => api.updateHabit(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habits'] }),
      onError: () => toast.error('Failed to update habit')
  });
  const deleteHabitMutation = useMutation({ 
      mutationFn: api.deleteHabit, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['habits'] });
          toast.success('Habit archived');
      },
      onError: () => toast.error('Failed to delete habit')
  });
  const toggleHabitLogMutation = useMutation({ 
      mutationFn: (vars: {habitId: string, date: string}) => api.toggleHabitLog(vars.habitId, vars.date), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habitLogs'] }),
      onError: () => toast.error('Failed to update log')
  });
  const updateHabitLogMutation = useMutation({ 
      mutationFn: (vars: {habitId: string, date: string, count: number}) => api.updateHabitLog(vars.habitId, vars.date, vars.count), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['habitLogs'] }),
      onError: () => toast.error('Failed to update log progress')
  });

  const createTransactionMutation = useMutation({ 
      mutationFn: api.createTransaction, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
      },
      onError: () => toast.error('Failed to save transaction')
  });

  const updateTransactionMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Transaction>}) => api.updateTransaction(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['transactions'] }),
      onError: () => toast.error('Failed to update transaction')
  });

  const deleteTransactionMutation = useMutation({ 
      mutationFn: api.deleteTransaction, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          toast.success('Transaction deleted');
      },
      onError: () => toast.error('Failed to delete transaction')
  });

  const createSubscriptionMutation = useMutation({ 
      mutationFn: api.createSubscription, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
          toast.success('Subscription saved');
      },
      onError: () => toast.error('Failed to save subscription')
  });

  const updateSubscriptionMutation = useMutation({ 
      mutationFn: (vars: {id: string, updates: Partial<Subscription>}) => api.updateSubscription(vars.id, vars.updates), 
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscriptions'] }),
      onError: () => toast.error('Failed to update subscription')
  });

  const deleteSubscriptionMutation = useMutation({ 
      mutationFn: api.deleteSubscription, 
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
          toast.success('Subscription removed');
      },
      onError: () => toast.error('Failed to delete subscription')
  });

  const createThoughtMutation = useMutation({
      mutationFn: api.createThought,
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['thoughts'] });
          // toast.success('Thought captured'); // Optional, maybe too noisy
      },
      onError: () => toast.error('Failed to save thought')
  });

  const contextValue: StoreContextType = useMemo(() => {
    const markLocalUpdate = () => { lastLocalUpdate.current = Date.now(); };

    return {
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
          uiStore.setFocusItem(item); 
          
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

      addHabit: (habit) => {
        markLocalUpdate();
        const newHabit = { ...habit, id: crypto.randomUUID() } as Habit;
        uiStore.addHabit(newHabit);
        createHabitMutation.mutate(newHabit);
      },
      updateHabit: (id, updates) => {
        markLocalUpdate();
        uiStore.updateHabit(id, updates);
        updateHabitMutation.mutate({ id, updates });
      },
      deleteHabit: (id) => {
        markLocalUpdate();
        uiStore.deleteHabit(id);
        deleteHabitMutation.mutate(id);
      },
      toggleHabitLog: (habitId, date) => {
        markLocalUpdate();
        
        const habit = uiStore.state.habits.find(h => h.id === habitId);
        const isCurrentlyLogged = uiStore.state.habitLogs.some(l => l.habitId === habitId && l.date === date);
        
        // 1. Update Habit Log
        uiStore.toggleHabitLog(habitId, date);
        toggleHabitLogMutation.mutate({ habitId, date });

        // 2. Integrated Activity Cross-post
        if (!isCurrentlyLogged && habit) {
            const newActId = crypto.randomUUID();
            const habitActivity: any = {
                id: newActId,
                name: `Selesai: ${habit.name}`,
                category: habit.pillar.charAt(0).toUpperCase() + habit.pillar.slice(1).toLowerCase(),
                color: '#10b981',
                intensity: 'medium',
                duration: 15,
                date: new Date(date).toISOString(),
                mood: 'Good',
                tags: [`#habit-${habitId}`]
            };
            uiStore.importData({ activities: [habitActivity, ...uiStore.state.activities] });
            createActivityMutation.mutate(habitActivity);
        } else if (isCurrentlyLogged) {
            const linkedAct = uiStore.state.activities.find(a => 
                a.tags?.includes(`#habit-${habitId}`) && 
                a.date.startsWith(date)
            );
            if (linkedAct) {
                uiStore.deleteActivity(linkedAct.id);
                deleteActivityMutation.mutate(linkedAct.id);
            }
        }
      },

      updateHabitLog: (habitId, date, count) => {
        markLocalUpdate();
        
        const habit = uiStore.state.habits.find(h => h.id === habitId);
        const existingLog = uiStore.state.habitLogs.find(l => l.habitId === habitId && l.date === date);
        const wasCompleted = existingLog && habit && existingLog.count >= habit.goal;
        const isNowCompleted = habit && count >= habit.goal;

        // 1. Update Habit Log
        uiStore.updateHabitLog(habitId, date, count);
        updateHabitLogMutation.mutate({ habitId, date, count });

        // 2. Cross-post logic
        if (!wasCompleted && isNowCompleted && habit) {
            const newActId = crypto.randomUUID();
            const habitActivity: any = {
                id: newActId,
                name: `Selesai: ${habit.name}`,
                category: habit.pillar.charAt(0).toUpperCase() + habit.pillar.slice(1).toLowerCase(),
                color: '#10b981',
                intensity: 'medium',
                duration: 15,
                date: new Date(date).toISOString(),
                mood: 'Good',
                tags: [`#habit-${habitId}`]
            };
            uiStore.importData({ activities: [habitActivity, ...uiStore.state.activities] });
            createActivityMutation.mutate(habitActivity);
        } else if (wasCompleted && !isNowCompleted) {
            const linkedAct = uiStore.state.activities.find(a => 
                a.tags?.includes(`#habit-${habitId}`) && 
                a.date.startsWith(date)
            );
            if (linkedAct) {
                uiStore.deleteActivity(linkedAct.id);
                deleteActivityMutation.mutate(linkedAct.id);
            }
        }
      },

      addTransaction: (transaction) => {
        markLocalUpdate();
        const newTrans = { ...transaction, id: crypto.randomUUID() };
        uiStore.addTransaction(newTrans);
        createTransactionMutation.mutate(newTrans);
      },
      updateTransaction: (id, updates) => {
        markLocalUpdate();
        uiStore.updateTransaction(id, updates);
        updateTransactionMutation.mutate({ id, updates });
      },
      deleteTransaction: (id) => {
        markLocalUpdate();
        uiStore.deleteTransaction(id);
        deleteTransactionMutation.mutate(id);
      },

      addSubscription: (sub) => {
        markLocalUpdate();
        const newSub = { ...sub, id: crypto.randomUUID() };
        uiStore.addSubscription(newSub);
        createSubscriptionMutation.mutate(newSub);
      },
      updateSubscription: (id, updates) => {
        markLocalUpdate();
        uiStore.updateSubscription(id, updates);
        updateSubscriptionMutation.mutate({ id, updates });
      },
      deleteSubscription: (id) => {
        markLocalUpdate();
        uiStore.deleteSubscription(id);
        deleteSubscriptionMutation.mutate(id);
      },

      addThought: (thought) => {
         markLocalUpdate();
         // Optimistic update
         uiStore.addThought(thought);
         createThoughtMutation.mutate(thought);
      },

      importData: uiStore.importData,
      login: (email, name) => {}, 
      logout: () => signOut.mutate(),
    };
  }, [
    user, profile, activities, pages, focusItems, habits, habitLogs, transactions, subscriptions, isAuthLoading, uiStore.state,
    createActivityMutation, updateActivityMutation, deleteActivityMutation,
    createPageMutation, updatePageMutation, deletePageMutation,
    createBlockMutation, updateBlockMutation, deleteBlockMutation,
    createFocusItemMutation, updateFocusItemMutation, deleteFocusItemMutation,
    createHabitMutation, updateHabitMutation, deleteHabitMutation, toggleHabitLogMutation, updateHabitLogMutation,
    createTransactionMutation, updateTransactionMutation, deleteTransactionMutation,
    createSubscriptionMutation, updateSubscriptionMutation, deleteSubscriptionMutation,
    createThoughtMutation,
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
