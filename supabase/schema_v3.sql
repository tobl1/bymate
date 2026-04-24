-- BYmate Schema v3: Team- und Talent-Profil-Erweiterung
-- Additiv zu schema.sql + schema_v2.sql. Idempotent.

-- ============================================================
-- profiles: Talent-Felder erweitern
-- ============================================================
alter table public.profiles
  add column if not exists photo_url text,
  add column if not exists seeker_type text check (seeker_type in ('cofounder', 'employee')),
  add column if not exists desired_stage text check (desired_stage in ('idea', 'prototype', 'early_users', 'revenue', 'funded')),
  add column if not exists contribution text,
  add column if not exists linkedin_url text,
  add column if not exists portfolio_url text;

-- ============================================================
-- listings: Team-Profil-Felder erweitern
-- ============================================================
alter table public.listings
  add column if not exists teaser text,
  add column if not exists gmbh_founded boolean not null default false,
  add column if not exists team_description text,
  add column if not exists story text,
  add column if not exists current_team text,
  add column if not exists why_us text,
  add column if not exists remote boolean not null default false,
  add column if not exists logo_url text,
  add column if not exists linkedin_company_url text,
  add column if not exists linkedin_person_url text,
  add column if not exists website_url text,
  add column if not exists expires_at timestamptz not null default (now() + interval '6 months');

-- stage check erweitern um "early_users" (ersetzt "mvp" fachlich)
alter table public.listings drop constraint if exists listings_stage_check;
alter table public.listings add constraint listings_stage_check
  check (stage in ('idea', 'prototype', 'early_users', 'mvp', 'revenue', 'funded'));

-- Bestehende "mvp"-Einträge auf "early_users" migrieren
update public.listings set stage = 'early_users' where stage = 'mvp';

-- Listings expires_at für bestehende Zeilen nachträglich setzen
update public.listings set expires_at = created_at + interval '6 months' where expires_at is null;

-- ============================================================
-- Storage: Buckets für Logos und Avatare
-- ============================================================
insert into storage.buckets (id, name, public)
  values ('logos', 'logos', true)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

-- Öffentliches Lesen
drop policy if exists "logos_public_read" on storage.objects;
create policy "logos_public_read"
  on storage.objects for select
  using (bucket_id = 'logos');

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

-- Upload nur für eingeloggte User, Dateiname beginnt mit ihrer user-id
drop policy if exists "logos_insert_own" on storage.objects;
create policy "logos_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_insert_own" on storage.objects;
create policy "avatars_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "logos_update_own" on storage.objects;
create policy "logos_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_update_own" on storage.objects;
create policy "avatars_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "logos_delete_own" on storage.objects;
create policy "logos_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'logos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "avatars_delete_own" on storage.objects;
create policy "avatars_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================================
-- Listings-RLS: expiration berücksichtigen (öffentlich sichtbar nur solange nicht abgelaufen)
-- ============================================================
drop policy if exists "listings_select_active" on public.listings;
create policy "listings_select_active"
  on public.listings for select
  using (
    (status = 'active' and expires_at > now())
    or owner_id = auth.uid()
  );
