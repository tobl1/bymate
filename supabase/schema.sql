-- BYmate Supabase Schema
-- Im Supabase SQL Editor laufen lassen. Idempotent wo möglich.

-- ============================================================
-- profiles
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  full_name text not null,
  role text not null check (role in ('founder', 'seeker')),
  bio text,
  location text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================================
-- listings  (Gesuche von Gründern)
-- ============================================================
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- Pseudonym-Mechanik:
  -- stealth = true  → startup_name wird öffentlich NICHT angezeigt
  stealth boolean not null default false,
  startup_name text,

  -- Pflichtfelder
  industry text not null,          -- z.B. "SaaS B2B", "Fintech", "Deeptech"
  stage text not null check (stage in ('idea', 'prototype', 'mvp', 'revenue', 'funded')),
  location text not null,          -- bayerische Stadt / Region
  description text not null,

  -- gesuchte Rollen als Tag-Liste, z.B. ['CTO','Sales','CMO']
  roles_needed text[] not null default '{}',

  status text not null default 'active' check (status in ('active', 'paused', 'closed'))
);

create index if not exists listings_created_at_idx on public.listings (created_at desc);
create index if not exists listings_owner_idx on public.listings (owner_id);

alter table public.listings enable row level security;

-- öffentlich sichtbar: aktive Listings
drop policy if exists "listings_select_active" on public.listings;
create policy "listings_select_active"
  on public.listings for select
  using (status = 'active' or owner_id = auth.uid());

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
  on public.listings for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'founder'
    )
  );

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own"
  on public.listings for update
  using (auth.uid() = owner_id);

drop policy if exists "listings_delete_own" on public.listings;
create policy "listings_delete_own"
  on public.listings for delete
  using (auth.uid() = owner_id);

-- updated_at Trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();
