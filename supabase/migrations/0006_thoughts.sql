create table if not exists public.thoughts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  type text default 'reflection',
  mood text,
  is_draft boolean default false,
  created_at timestamptz default now()
);

alter table public.thoughts enable row level security;

create policy "Users can view their own thoughts"
  on public.thoughts for select
  using (auth.uid() = user_id);

create policy "Users can insert their own thoughts"
  on public.thoughts for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own thoughts"
  on public.thoughts for update
  using (auth.uid() = user_id);

create policy "Users can delete their own thoughts"
  on public.thoughts for delete
  using (auth.uid() = user_id);
