-- 8. Transactions (Money Tracker)
create table public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('income', 'expense')),
  category text not null,
  amount numeric not null,
  description text,
  date timestamptz not null default timezone('utc'::text, now()),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.transactions enable row level security;

-- Policies for Transactions
create policy "Users can manage own transactions" on public.transactions
  for all using (auth.uid() = user_id);

-- 9. Subscriptions
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  amount numeric not null,
  billing_cycle text not null check (billing_cycle in ('monthly', 'yearly')),
  category text not null,
  next_billing_date date not null,
  active boolean default true,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.subscriptions enable row level security;

-- Policies for Subscriptions
create policy "Users can manage own subscriptions" on public.subscriptions
  for all using (auth.uid() = user_id);
