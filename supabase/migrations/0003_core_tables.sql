-- 1. Profiles (Extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade not null primary key,
  email text,
  name text,
  tagline text default 'I am doing enough.',
  avatar_color text default '#37352f',
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 2. User Preferences
create table public.user_preferences (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  theme text default 'light',
  week_start text default 'monday',
  language text default 'en',
  dashboard_config jsonb, -- Stores toggles like showHeatmap, showReflection
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Engine Settings
create table public.engine_settings (
  user_id uuid references public.profiles(id) on delete cascade not null primary key,
  energy_guardian boolean default true,
  rest_encourager boolean default true,
  high_intensity_limit integer default 2,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. Activities (Log Entries)
create table public.activities (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  category text not null,
  color text,
  intensity text,
  duration integer,
  mood text,
  date timestamptz not null,
  tags text[],
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. Focus Items (Kanban Board Items)
create table public.focus_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  activity_id uuid references public.activities(id) on delete set null,
  "column" text not null, -- 'primary', 'secondary', 'rest'
  date text not null, -- Stores 'YYYY-MM-DD'
  completed boolean default false,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. Pages
create table public.pages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  icon text,
  type text default 'private', -- 'system' or 'private'
  parent_id uuid references public.pages(id) on delete cascade,
  context_rules jsonb,
  "order" integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. Blocks (Content inside Pages)
create table public.blocks (
  id uuid default uuid_generate_v4() primary key,
  page_id uuid references public.pages(id) on delete cascade not null,
  type text not null,
  content text default '',
  config jsonb,
  text_color text,
  background_color text,
  "order" integer default 0, -- To maintain block order
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);
