-- BYmate Schema v2: Talents + Messaging
-- Im Supabase SQL Editor ausführen, additiv zu schema.sql.

-- ============================================================
-- profiles erweitern
-- ============================================================
alter table public.profiles
  add column if not exists headline text,
  add column if not exists skills text[] not null default '{}',
  add column if not exists available boolean not null default true;

-- ============================================================
-- messages
-- ============================================================
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users on delete cascade,
  recipient_id uuid not null references auth.users on delete cascade,
  listing_id uuid references public.listings on delete set null,
  body text not null,
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (sender_id <> recipient_id)
);

create index if not exists messages_sender_idx on public.messages (sender_id, created_at desc);
create index if not exists messages_recipient_idx on public.messages (recipient_id, created_at desc);

alter table public.messages enable row level security;

grant select, insert, update on public.messages to authenticated;

drop policy if exists "messages_select_pair" on public.messages;
create policy "messages_select_pair"
  on public.messages for select
  using (auth.uid() = sender_id or auth.uid() = recipient_id);

drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own"
  on public.messages for insert
  with check (
    auth.uid() = sender_id
    and exists (select 1 from public.profiles where id = auth.uid())
  );

drop policy if exists "messages_update_recipient" on public.messages;
create policy "messages_update_recipient"
  on public.messages for update
  using (auth.uid() = recipient_id);
