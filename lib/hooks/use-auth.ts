import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export function useUser() {
    return useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        },
        staleTime: Infinity, // User session rarely changes without action
    });
}

export function useSignOut() {
    const queryClient = useQueryClient();
    const supabase = createClient();

    return useMutation({
        mutationFn: async () => {
            await supabase.auth.signOut();
        },
        onSuccess: () => {
            queryClient.setQueryData(['user'], null);
            queryClient.invalidateQueries(); // Clear all data on logout
            window.location.href = '/auth'; // Force reload/redirect
        }
    })
}
