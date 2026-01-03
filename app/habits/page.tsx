'use client';

import React from 'react';
import { useStore } from '../../lib/store-provider';
import { HabitTrackerLayout } from '../../components/habit-tracker/HabitTrackerLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function HabitsPage() {
    const { 
        state: { habits, habitLogs, isAuthenticated, userPreferences, userProfile },
        isLoaded,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitLog,
        updateHabitLog,
        updateUserPreferences
    } = useStore();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null; // ProtectedRoute will handle redirect

    return (
        <ProtectedRoute>
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors">
                <HabitTrackerLayout 
                    habits={habits}
                    logs={habitLogs}
                    userPreferences={userPreferences}
                    userProfile={userProfile}
                    onAddHabit={addHabit}
                    onUpdateHabit={updateHabit}
                    onDeleteHabit={deleteHabit}
                    onToggleLog={toggleHabitLog}
                    onUpdateLog={updateHabitLog}
                    onUpdatePreferences={updateUserPreferences}
                />
            </div>
        </ProtectedRoute>
    );
}
