'use client';

import React from 'react';
import { useStore } from '../../lib/store-provider';
import { MoneyTrackerLayout } from '../../components/money-tracker/MoneyTrackerLayout';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function MoneyPage() {
    const { 
        state: { transactions, subscriptions, isAuthenticated, userProfile },
        isLoaded,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addSubscription,
        updateSubscription,
        deleteSubscription
    } = useStore();

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 rounded-full border-4 border-zinc-200 border-t-zinc-900 animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <ProtectedRoute>
            <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen transition-colors">
                <MoneyTrackerLayout 
                    transactions={transactions}
                    subscriptions={subscriptions}
                    userProfile={userProfile}
                    onAddTransaction={addTransaction}
                    onUpdateTransaction={updateTransaction}
                    onDeleteTransaction={deleteTransaction}
                    onAddSubscription={addSubscription}
                    onUpdateSubscription={updateSubscription}
                    onDeleteSubscription={deleteSubscription}
                />
            </div>
        </ProtectedRoute>
    );
}
