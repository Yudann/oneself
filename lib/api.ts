import { createClient } from '@/utils/supabase/client';
import { AppState, Page, Activity, UserProfile, UserPreferences, EngineSettings, FocusItem, Block, BlockType, Habit, HabitLog, Transaction, Subscription, Thought } from './types';

const supabase = createClient();

// --- Profile ---
export async function getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
        .from('profiles')
        .select('name, email, tagline, avatar_color')
        .eq('id', userId)
        .single();

    if (error) throw error;
    if (!data) return null;

    return {
        name: data.name,
        email: data.email,
        tagline: data.tagline,
        avatarColor: data.avatar_color,
    };
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.tagline) dbUpdates.tagline = updates.tagline;
    if (updates.avatarColor) dbUpdates.avatar_color = updates.avatarColor;

    const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId);
    if (error) throw error;
}

// --- Activities ---
export async function getActivities(): Promise<Activity[]> {
    const { data, error } = await supabase.from('activities').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data || [];
}

export async function createActivity(activity: Activity) {
    const { id, ...rest } = activity;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('activities').insert({
        ...rest,
        id: id,
        user_id: user.id
    });
    if (error) throw error;
}

export async function deleteActivity(id: string) {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    if (error) throw error;
}

export async function updateActivity(id: string, updates: Partial<Activity>) {
    const { error } = await supabase.from('activities').update(updates).eq('id', id);
    if (error) throw error;
}

// --- Pages ---
export async function getPages(): Promise<Page[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: pagesData, error: pagesError } = await supabase
        .from('pages')
        .select('*')
        .order('order', { ascending: true });

    if (pagesError) throw pagesError;
    if (!pagesData) return [];

    const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .order('order', { ascending: true });

    if (blocksError) throw blocksError;

    const pages: Page[] = pagesData.map(p => ({
        id: p.id,
        title: p.title,
        icon: p.icon,
        type: p.type as 'system' | 'private',
        parentId: p.parent_id,
        blocks: blocksData.filter(b => b.page_id === p.id).map(b => ({
            id: b.id,
            type: b.type as BlockType,
            content: b.content,
            config: b.config,
            textColor: b.text_color,
            backgroundColor: b.background_color,
            parentId: b.parent_id
        })),
        contextRules: p.context_rules
    }));

    return pages;
}

export async function createPage(page: Page) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('pages').insert({
        id: page.id,
        user_id: user.id,
        title: page.title,
        icon: page.icon,
        type: page.type,
        parent_id: page.parentId,
        context_rules: page.contextRules
    });
    if (error) throw error;
}

export async function updatePage(id: string, updates: Partial<Page>) {
    const dbUpdates: any = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;

    const { error } = await supabase.from('pages').update(dbUpdates).eq('id', id);
    if (error) throw error;
}

export async function deletePage(id: string) {
    const { error } = await supabase.from('pages').delete().eq('id', id);
    if (error) throw error;
}

// --- Blocks ---
export async function createBlock(pageId: string, block: Block) {
    const { error } = await supabase.from('blocks').insert({
        id: block.id,
        page_id: pageId,
        type: block.type,
        content: block.content,
        config: block.config,
        text_color: block.textColor,
        background_color: block.backgroundColor,
        parent_id: block.parentId
    });
    if (error) throw error;
}

export async function updateBlock(id: string, updates: Partial<Block>) {
    const dbUpdates: any = {};
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.config !== undefined) dbUpdates.config = updates.config;
    if (updates.textColor !== undefined) dbUpdates.text_color = updates.textColor;
    if (updates.backgroundColor !== undefined) dbUpdates.background_color = updates.backgroundColor;
    if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId;

    const { error } = await supabase.from('blocks').update(dbUpdates).eq('id', id);
    if (error) throw error;
}

export async function deleteBlock(id: string) {
    const { error } = await supabase.from('blocks').delete().eq('id', id);
    if (error) throw error;
}

// --- Focus Items ---
export async function getFocusItems(): Promise<FocusItem[]> {
    const { data, error } = await supabase.from('focus_items').select('*');
    if (error) throw error;
    return data?.map(d => ({
        id: d.id,
        activityId: d.activity_id,
        column: d.column,
        date: d.date,
        completed: d.completed
    })) || [];
}

export async function createFocusItem(item: FocusItem) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase.from('focus_items').insert({
        id: item.id,
        user_id: user.id,
        activity_id: item.activityId,
        column: item.column,
        date: item.date,
        completed: item.completed
    });
    if (error) throw error;
}

export async function updateFocusItem(id: string, updates: Partial<FocusItem>) {
    const dbUpdates: any = {};
    if (updates.column !== undefined) dbUpdates.column = updates.column;
    if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
    // Don't update date usually
    const { error } = await supabase.from('focus_items').update(dbUpdates).eq('id', id);
    if (error) throw error;
}

export async function deleteFocusItem(id: string) {
    const { error } = await supabase.from('focus_items').delete().eq('id', id);
    if (error) throw error;
}


// Habits
export async function getHabits() {
    const supabase = createClient();
    const { data, error } = await supabase.from('habits').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Habit[];
}

export async function getHabitLogs() {
    const supabase = createClient();
    const { data, error } = await supabase.from('habit_logs').select('*');
    if (error) throw error;
    return data.map(l => ({
        id: l.id,
        habitId: l.habit_id,
        userId: l.user_id,
        date: l.date,
        count: l.count,
        note: l.note,
        createdAt: l.created_at
    })) as HabitLog[];
}

export async function createHabit(habit: Habit) {
    const supabase = createClient();
    const { error } = await supabase.from('habits').insert({
        id: habit.id,
        name: habit.name,
        pillar: habit.pillar,
        frequency: habit.frequency,
        goal: habit.goal,
        user_id: (await supabase.auth.getUser()).data.user?.id
    });
    if (error) throw error;
}

export async function updateHabit(id: string, updates: Partial<Habit>) {
    const supabase = createClient();
    const { error } = await supabase.from('habits').update(updates).eq('id', id);
    if (error) throw error;
}

export async function deleteHabit(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('habits').delete().eq('id', id);
    if (error) throw error;
}

export async function toggleHabitLog(habitId: string, date: string) {
    const supabase = createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("No user");

    // Check existing
    const { data } = await supabase.from('habit_logs')
        .select('id')
        .eq('habit_id', habitId)
        .eq('date', date)
        .maybeSingle(); // Use maybeSingle to avoid 406 error if 0 rows

    if (data) {
        // Remove
        const { error } = await supabase.from('habit_logs').delete().eq('id', data.id);
        if (error) throw error;
        return 'deleted';
    } else {
        // Insert
        const { error } = await supabase.from('habit_logs').insert({
            habit_id: habitId,
            date: date,
            count: 1,
            user_id: user.id
        });
        if (error) throw error;
        return 'created';
    }
}

export async function updateHabitLog(habitId: string, date: string, count: number) {
    const supabase = createClient();
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error("No user");

    if (count <= 0) {
        const { error } = await supabase.from('habit_logs').delete().eq('habit_id', habitId).eq('date', date);
        if (error) throw error;
        return 'deleted';
    }

    const { data: existing } = await supabase.from('habit_logs')
        .select('id')
        .eq('habit_id', habitId)
        .eq('date', date)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase.from('habit_logs').update({ count }).eq('id', existing.id);
        if (error) throw error;
        return 'updated';
    } else {
        const { error } = await supabase.from('habit_logs').insert({
            habit_id: habitId,
            date: date,
            count,
            user_id: user.id
        });
        if (error) throw error;
        return 'created';
    }
}

export async function getTransactions(): Promise<Transaction[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('transactions')
        .select('*')
        .order('date', { ascending: false });

    if (error) throw error;
    return (data || []).map(t => ({
        id: t.id,
        userId: t.user_id,
        type: t.type,
        category: t.category,
        amount: t.amount,
        description: t.description,
        date: t.date,
        createdAt: t.created_at
    })) as Transaction[];
}

export async function createTransaction(transaction: Transaction) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('transactions').insert({
        id: transaction.id,
        user_id: user.id,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date
    }).select().single();

    if (error) throw error;
    return {
        ...data,
        userId: data.user_id,
        createdAt: data.created_at
    } as Transaction;
}

export async function updateTransaction(id: string, updates: Partial<Transaction>) {
    const supabase = createClient();
    const dbUpdates: any = {};
    if (updates.type) dbUpdates.type = updates.type;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.date) dbUpdates.date = updates.date;

    const { data, error } = await supabase.from('transactions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return {
        ...data,
        userId: data.user_id,
        createdAt: data.created_at
    } as Transaction;
}

export async function deleteTransaction(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw error;
}

// --- Subscriptions ---
export async function getSubscriptions(): Promise<Subscription[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('subscriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(s => ({
        id: s.id,
        userId: s.user_id,
        name: s.name,
        amount: s.amount,
        billingCycle: s.billing_cycle,
        category: s.category,
        nextBillingDate: s.next_billing_date,
        active: s.active,
        createdAt: s.created_at
    })) as Subscription[];
}

export async function createSubscription(sub: Subscription) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('subscriptions').insert({
        id: sub.id,
        user_id: user.id,
        name: sub.name,
        amount: sub.amount,
        billing_cycle: sub.billingCycle,
        category: sub.category,
        next_billing_date: sub.nextBillingDate,
        active: sub.active
    }).select().single();

    if (error) throw error;
    return {
        ...data,
        userId: data.user_id,
        billingCycle: data.billing_cycle,
        nextBillingDate: data.next_billing_date,
        createdAt: data.created_at
    } as Subscription;
}

export async function updateSubscription(id: string, updates: Partial<Subscription>) {
    const supabase = createClient();
    const dbUpdates: any = {};
    if (updates.name) dbUpdates.name = updates.name;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.billingCycle) dbUpdates.billing_cycle = updates.billingCycle;
    if (updates.category) dbUpdates.category = updates.category;
    if (updates.nextBillingDate) dbUpdates.next_billing_date = updates.nextBillingDate;
    if (updates.active !== undefined) dbUpdates.active = updates.active;

    const { data, error } = await supabase.from('subscriptions')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return {
        ...data,
        userId: data.user_id,
        billingCycle: data.billing_cycle,
        nextBillingDate: data.next_billing_date,
        createdAt: data.created_at
    } as Subscription;
}

export async function deleteSubscription(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('subscriptions').delete().eq('id', id);
    if (error) throw error;
}

// --- Thoughts ---
export async function getThoughts(): Promise<Thought[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from('thoughts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(t => ({
        id: t.id,
        userId: t.user_id,
        content: t.content,
        type: t.type,
        mood: t.mood,
        isDraft: t.is_draft,
        createdAt: t.created_at
    })) as Thought[];
}

export async function createThought(thought: Thought) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase.from('thoughts').insert({
        content: thought.content,
        type: thought.type,
        mood: thought.mood,
        is_draft: thought.isDraft,
        user_id: user.id
    }).select().single();

    if (error) throw error;
    return {
        id: data.id,
        userId: data.user_id,
        content: data.content,
        type: data.type,
        mood: data.mood,
        isDraft: data.is_draft,
        createdAt: data.created_at
    } as Thought;
}
