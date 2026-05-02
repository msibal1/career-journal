-- Career Journal — initial schema
-- Run this once in Supabase Studio → SQL Editor → New query → paste → Run.

-- =============================================================================
-- profiles: one row per user, holds settings
-- =============================================================================

create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  friday_nudge boolean not null default false,
  welcome_seen boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Profiles select self" on public.profiles;
create policy "Profiles select self"
  on public.profiles for select
  using (auth.uid() = user_id);

drop policy if exists "Profiles insert self" on public.profiles;
create policy "Profiles insert self"
  on public.profiles for insert
  with check (auth.uid() = user_id);

drop policy if exists "Profiles update self" on public.profiles;
create policy "Profiles update self"
  on public.profiles for update
  using (auth.uid() = user_id);

-- =============================================================================
-- entries: one row per week per user
-- =============================================================================

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  week_iso text not null,
  week_start timestamptz not null,
  wins jsonb not null default '[]'::jsonb,
  metrics jsonb not null default '[]'::jsonb,
  skills jsonb not null default '[]'::jsonb,
  projects jsonb not null default '[]'::jsonb,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, week_iso)
);

create index if not exists entries_user_week_start_idx
  on public.entries (user_id, week_start desc);

alter table public.entries enable row level security;

drop policy if exists "Entries select self" on public.entries;
create policy "Entries select self"
  on public.entries for select
  using (auth.uid() = user_id);

drop policy if exists "Entries insert self" on public.entries;
create policy "Entries insert self"
  on public.entries for insert
  with check (auth.uid() = user_id);

drop policy if exists "Entries update self" on public.entries;
create policy "Entries update self"
  on public.entries for update
  using (auth.uid() = user_id);

drop policy if exists "Entries delete self" on public.entries;
create policy "Entries delete self"
  on public.entries for delete
  using (auth.uid() = user_id);

-- =============================================================================
-- Auto-create a profile row when a new auth user is created
-- =============================================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (user_id) values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
