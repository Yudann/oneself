-- Enable RLS
alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.engine_settings enable row level security;
alter table public.activities enable row level security;
alter table public.focus_items enable row level security;
alter table public.pages enable row level security;
alter table public.blocks enable row level security;

-- Policies (Users can only access their own data)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own preferences" on public.user_preferences for select using (auth.uid() = user_id);
create policy "Users can update own preferences" on public.user_preferences for update using (auth.uid() = user_id);
create policy "Users can insert own preferences" on public.user_preferences for insert with check (auth.uid() = user_id);

create policy "Users can view own engine settings" on public.engine_settings for select using (auth.uid() = user_id);
create policy "Users can update own engine settings" on public.engine_settings for update using (auth.uid() = user_id);
create policy "Users can insert own engine settings" on public.engine_settings for insert with check (auth.uid() = user_id);

create policy "Users can manage own activities" on public.activities for all using (auth.uid() = user_id);

create policy "Users can manage own focus items" on public.focus_items for all using (auth.uid() = user_id);

create policy "Users can manage own pages" on public.pages for all using (auth.uid() = user_id);

-- Blocks don't have user_id directly, they check via page_id -> user_id
create policy "Users can manage own blocks" on public.blocks for all using (
  exists (
    select 1 from public.pages
    where public.pages.id = public.blocks.page_id
    and public.pages.user_id = auth.uid()
  )
);
