"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useAppStore } from './store';
import { AppState, Page, Activity, UserProfile, UserPreferences, EngineSettings, FocusItem, Block, BlockType } from './types';

// Define the shape of the context
type StoreContextType = ReturnType<typeof useAppStore>;

const StoreContext = createContext<StoreContextType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const store = useAppStore();

  return (
    <StoreContext.Provider value={store}>
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
