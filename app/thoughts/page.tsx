'use client';

import React from 'react';
import { ThoughtsLayout } from '@/components/thoughts/ThoughtsLayout';
import { useStore } from '@/lib/store-provider';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import { toast } from 'sonner';
import { Thought } from '@/lib/types';

export default function ThoughtsPage() {
    const { state } = useStore();
    const queryClient = useQueryClient();

    const createThoughtMutation = useMutation({
        mutationFn: api.createThought,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['thoughts'] });
            toast.success('Saved to your mind.');
        },
        onError: () => toast.error('Failed to save thought')
    });

    const handleAddThought = (thoughtData: Partial<Thought>) => {
        // We cast to Thought because api expect it, but really it only needs content/type/mood/isDraft
        // The API function will ignore ID/UserId if we don't pass them or handle them on server
        // Actually api.createThought expects Thought, but let's check what it uses.
        // It uses content, type, mood, isDraft.
        createThoughtMutation.mutate(thoughtData as Thought);
    };

    return (
        <ThoughtsLayout 
            thoughts={state.thoughts || []}
            userProfile={state.userProfile}
            onAddThought={handleAddThought}
        />
    );
}
