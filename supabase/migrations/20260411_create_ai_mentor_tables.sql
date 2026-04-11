create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Study Warrior',
  target_exam text not null default 'UPSC CSE',
  exam_date date,
  available_hours_per_day numeric(4,2),
  week_start text not null default 'Monday',
  mentor_day text not null default 'Sunday',
  mentor_time text not null default '9:00 AM',
  monthly_review_day text not null default '1',
  daily_reminder boolean not null default true,
  session_reminder boolean not null default true,
  mentor_reminder boolean not null default true,
  streak_reminder boolean not null default false,
  theme text not null default 'light',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_week_start_check check (week_start in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  constraint profiles_mentor_day_check check (mentor_day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  constraint profiles_theme_check check (theme in ('light', 'dark'))
);

create table if not exists public.study_subjects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  position integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  unique (user_id, name)
);

create table if not exists public.planner_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  start_time time not null,
  end_time time not null,
  subject text not null,
  topic text not null default '',
  session_type text not null,
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint planner_entries_session_type_check check (session_type in ('concept', 'practice', 'revision', 'mock', 'analysis'))
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  session_type text not null,
  subject text not null,
  topic text not null,
  duration integer not null,
  mood text not null,
  stress_reason text,
  notes text,
  questions_attempted integer,
  correct_answers integer,
  hardness text,
  mistakes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint journal_entries_session_type_check check (session_type in ('concept', 'practice', 'revision', 'mock', 'analysis')),
  constraint journal_entries_mood_check check (mood in ('focused', 'distracted', 'tired', 'motivated', 'frustrated', 'stressed')),
  constraint journal_entries_hardness_check check (hardness is null or hardness in ('easy', 'medium', 'hard', 'mixed'))
);

create table if not exists public.doubts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text,
  subject text,
  topic text,
  date date not null,
  image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.mock_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  test text not null,
  score integer not null,
  created_at timestamptz not null default timezone('utc', now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1), 'Study Warrior')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists planner_entries_set_updated_at on public.planner_entries;
create trigger planner_entries_set_updated_at
  before update on public.planner_entries
  for each row execute procedure public.set_updated_at();

drop trigger if exists journal_entries_set_updated_at on public.journal_entries;
create trigger journal_entries_set_updated_at
  before update on public.journal_entries
  for each row execute procedure public.set_updated_at();

drop trigger if exists doubts_set_updated_at on public.doubts;
create trigger doubts_set_updated_at
  before update on public.doubts
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.study_subjects enable row level security;
alter table public.planner_entries enable row level security;
alter table public.journal_entries enable row level security;
alter table public.doubts enable row level security;
alter table public.mock_scores enable row level security;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "Users can delete own profile" on public.profiles;
create policy "Users can delete own profile"
  on public.profiles for delete
  using (auth.uid() = id);

drop policy if exists "Users can manage own study subjects" on public.study_subjects;
create policy "Users can manage own study subjects"
  on public.study_subjects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own planner entries" on public.planner_entries;
create policy "Users can manage own planner entries"
  on public.planner_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own journal entries" on public.journal_entries;
create policy "Users can manage own journal entries"
  on public.journal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own doubts" on public.doubts;
create policy "Users can manage own doubts"
  on public.doubts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can manage own mock scores" on public.mock_scores;
create policy "Users can manage own mock scores"
  on public.mock_scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter publication supabase_realtime add table public.profiles;
alter publication supabase_realtime add table public.study_subjects;
alter publication supabase_realtime add table public.planner_entries;
alter publication supabase_realtime add table public.journal_entries;
alter publication supabase_realtime add table public.doubts;
alter publication supabase_realtime add table public.mock_scores;
