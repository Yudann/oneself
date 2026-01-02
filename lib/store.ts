
import { useState, useEffect, useCallback } from 'react';
import { Activity, FocusItem, Page, AppState, UserProfile, EngineSettings, UserPreferences, Block, BlockType, Habit, HabitLog } from './types';
import { INITIAL_PAGES } from './constants';

const STORAGE_KEY = 'oneself_v1_state';

const DEFAULT_STATE: AppState = {
  activities: [],
  focusItems: [],
  pages: INITIAL_PAGES,
  habits: [],
  habitLogs: [],
  currentPageId: 'dashboard',
  sidebarOpen: true,
  userProfile: {
    name: 'Human Being',
    email: 'hello@oneself.app',
    tagline: 'I am doing enough.',
    avatarColor: '#37352f'
  },
  userPreferences: {
    theme: 'light',
    weekStart: 'monday',
    language: 'en',
    dashboardShowHeatmap: true,
    dashboardShowReflection: true,
  },
  engineSettings: {
    energyGuardian: true,
    restEncourager: true,
    highIntensityLimit: 2
  },
  isAuthenticated: false
};

export const useAppStore = () => {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState({
          ...DEFAULT_STATE,
          ...parsed,
          userProfile: { ...DEFAULT_STATE.userProfile, ...parsed.userProfile },
          userPreferences: { ...DEFAULT_STATE.userPreferences, ...parsed.userPreferences },
          engineSettings: { ...DEFAULT_STATE.engineSettings, ...parsed.engineSettings },
          pages: parsed.pages || INITIAL_PAGES
        });
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const setPage = (id: string) => setState(prev => ({ ...prev, currentPageId: id }));

  const toggleSidebar = () => setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));

  // Page CRUD (Private Only)
  const addPrivatePage = (parentId?: string) => {
    const newPage: Page = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Page',
      icon: '📄',
      type: 'private',
      parentId,
      blocks: []
    };
    setState(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
      currentPageId: newPage.id
    }));
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setState(prev => {
      const page = prev.pages.find(p => p.id === id);
      if (!page || page.type === 'system') return prev;
      return {
        ...prev,
        pages: prev.pages.map(p => p.id === id ? { ...p, ...updates } : p)
      };
    });
  };

  const deletePage = (id: string) => {
    setState(prev => {
      const page = prev.pages.find(p => p.id === id);
      if (!page || page.type === 'system') return prev;
      return {
        ...prev,
        pages: prev.pages.filter(p => p.id !== id),
        currentPageId: prev.currentPageId === id ? 'dashboard' : prev.currentPageId
      };
    });
  };

  // Block CRUD (Private Only)
  const addBlockToPage = (pageId: string, type: BlockType, config?: any) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId || p.type === 'system') return p;
        const newBlock: Block = {
          id: Math.random().toString(36).substr(2, 9),
          type,
          content: '',
          config
        };
        return { ...p, blocks: [...p.blocks, newBlock] };
      })
    }));
  };

  const updateBlock = (pageId: string, blockId: string, updates: Partial<Block>) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId || p.type === 'system') return p;
        return {
          ...p,
          blocks: p.blocks.map(b => b.id === blockId ? { ...b, ...updates } : b)
        };
      })
    }));
  };

  const deleteBlock = (pageId: string, blockId: string) => {
    setState(prev => ({
      ...prev,
      pages: prev.pages.map(p => {
        if (p.id !== pageId || p.type === 'system') return p;
        return {
          ...p,
          blocks: p.blocks.filter(b => b.id !== blockId)
        };
      })
    }));
  };

  // Rest of state logic remains unchanged
  const addActivity = useCallback((activity: Omit<Activity, 'id'>) => {
    const newActivity: Activity = {
      ...activity,
      id: Math.random().toString(36).substr(2, 9),
    };
    setState(prev => ({
      ...prev,
      activities: [newActivity, ...prev.activities],
    }));
    return newActivity;
  }, []);

  const deleteActivity = (id: string) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id),
      focusItems: prev.focusItems.filter(f => f.activityId !== id),
    }));
  };

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setState(prev => ({
      ...prev,
      activities: prev.activities.map(a => a.id === id ? { ...a, ...updates } : a),
    }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));
  };

  const updateUserPreferences = (updates: Partial<UserPreferences>) => {
    setState(prev => ({
      ...prev,
      userPreferences: { ...prev.userPreferences, ...updates }
    }));
  };

  const updateEngineSettings = (updates: Partial<EngineSettings>) => {
    setState(prev => ({
      ...prev,
      engineSettings: { ...prev.engineSettings, ...updates }
    }));
  };

  const setFocusItem = (item: Omit<FocusItem, 'id' | 'completed'>) => {
    const existing = state.focusItems.find(f => f.activityId === item.activityId && f.date === item.date);
    if (existing) {
      setState(prev => ({
        ...prev,
        focusItems: prev.focusItems.map(f => f.id === existing.id ? { ...f, column: item.column } : f),
      }));
    } else {
      const newItem: FocusItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        completed: false
      };
      setState(prev => ({
        ...prev,
        focusItems: [...prev.focusItems, newItem],
      }));
    }
  };

  const moveFocusItem = (id: string, column: FocusItem['column']) => {
    setState(prev => ({
      ...prev,
      focusItems: prev.focusItems.map(f => f.id === id ? { ...f, column } : f),
    }));
  };

  const toggleFocusItemCompletion = (id: string) => {
    setState(prev => ({
      ...prev,
      focusItems: prev.focusItems.map(f => f.id === id ? { ...f, completed: !f.completed } : f),
    }));
  };

  const removeFocusItem = (id: string) => {
    setState(prev => ({
      ...prev,
      focusItems: prev.focusItems.filter(f => f.id !== id),
    }));
  };

  const addHabit = (habit: Habit) => {
    setState(prev => ({ ...prev, habits: [habit, ...prev.habits] }));
  };

  const updateHabit = (id: string, updates: Partial<Habit>) => {
    setState(prev => ({ ...prev, habits: prev.habits.map(h => h.id === id ? { ...h, ...updates } : h) }));
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  const toggleHabitLog = (habitId: string, date: string) => {
    setState(prev => {
      const exists = prev.habitLogs.find(l => l.habitId === habitId && l.date === date);
      if (exists) {
        return { ...prev, habitLogs: prev.habitLogs.filter(l => l.id !== exists.id) };
      } else {
        const newLog: HabitLog = {
          id: crypto.randomUUID(),
          habitId,
          date,
          count: 1
        };
        return { ...prev, habitLogs: [...prev.habitLogs, newLog] };
      }
    });
  };

  const importData = (data: Partial<AppState>) => {
    setState(prev => ({
      ...prev,
      ...data,
      activities: data.activities || prev.activities,
      focusItems: data.focusItems || prev.focusItems,
      habits: data.habits || prev.habits,
      habitLogs: data.habitLogs || prev.habitLogs,
    }));
  };

  const login = (email: string, name: string) => {
    setState(prev => ({
      ...prev,
      isAuthenticated: true,
      userProfile: {
        ...prev.userProfile,
        email,
        name,
      }
    }));
  };

  const logout = () => {
    setState(prev => ({
      ...prev,
      isAuthenticated: false
    }));
  };

  return {
    state,
    isLoaded,
    setPage,
    toggleSidebar,
    addPrivatePage,
    updatePage,
    deletePage,
    addBlockToPage,
    updateBlock,
    deleteBlock,
    addActivity,
    deleteActivity,
    updateActivity,
    updateUserProfile,
    updateUserPreferences,
    updateEngineSettings,
    setFocusItem,
    moveFocusItem,
    toggleFocusItemCompletion,
    removeFocusItem,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitLog,
    importData,
    login,
    logout
  };
};
