import { createClient } from '@/utils/supabase/client';
import { Activity, Page, Block, FocusItem, UserProfile, BlockType } from './types';

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
            backgroundColor: b.background_color
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
        background_color: block.backgroundColor
    });
    if (error) throw error;
}

export async function updateBlock(id: string, updates: Partial<Block>) {
    const dbUpdates: any = {};
    if (updates.content !== undefined) dbUpdates.content = updates.content;
    if (updates.config !== undefined) dbUpdates.config = updates.config;
    if (updates.textColor !== undefined) dbUpdates.text_color = updates.textColor;
    if (updates.backgroundColor !== undefined) dbUpdates.background_color = updates.backgroundColor;

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
