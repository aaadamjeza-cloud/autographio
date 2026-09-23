-- Autografio — initial schema.
-- Standalone Supabase project. Do NOT run against Monetio's project.
-- Review before running; this is not applied automatically.

create extension if not exists pgcrypto;

-- ── Enums ────────────────────────────────────────────────────────────────
create type item_type as enum ('autograph', 'photo', 'card', 'jersey', 'letter', 'other');
create type authentication_type as enum ('certificate', 'in_person', 'unverified');
create type person_category as enum ('actor', 'musician', 'athlete', 'writer', 'other');
create type moderation_status as enum ('pending', 'approved');
create type request_status as enum ('waiting', 'received', 'returned', 'no_response');
create type return_postage_type as enum ('fr_stamp', 'cz_stamp', 'irc', 'other', 'none');
create type content_target_type as enum ('person', 'item_photo', 'price_report');

-- ── profiles ─────────────────────────────────────────────────────────────
-- One row per auth user, created by the app right after the user picks a
-- display name (see onboarding screen) — not by a trigger, so a user always
-- exists with no public identity until they've actually chosen one.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  show_name_on_photos boolean not null default true,
  created_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "profiles: owner select" on profiles
  for select using (auth.uid() = id);
create policy "profiles: owner insert" on profiles
  for insert with check (auth.uid() = id);
create policy "profiles: owner update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles: owner delete" on profiles
  for delete using (auth.uid() = id);
-- No public SELECT policy yet — nothing in the MVP shows another user's
-- display_name. Add a narrow view/policy for that when public photos ship.

-- ── persons (catalog) ───────────────────────────────────────────────────
create table persons (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category person_category not null,
  birth_year integer,
  death_year integer,
  nationality text,
  wikidata_id text,
  tmdb_person_id integer,
  portrait_commons_file text,
  portrait_author text,
  portrait_license text,
  portrait_source_url text,
  status moderation_status not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index persons_status_idx on persons(status);

alter table persons enable row level security;

create policy "persons: public reads approved" on persons
  for select using (status = 'approved');
create policy "persons: creator reads own pending" on persons
  for select using (auth.uid() = created_by);
-- No public INSERT/UPDATE/DELETE policy — the MVP has no "submit a person"
-- screen yet; catalog entries are seeded/managed with the admin (service
-- role) client, which bypasses RLS entirely.

-- ── portfolio_items ──────────────────────────────────────────────────────
create table portfolio_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid references persons(id) on delete set null,
  custom_person_name text,
  item_type item_type not null,
  authentication authentication_type not null default 'unverified',
  purchase_price numeric(12, 2) check (purchase_price is null or purchase_price >= 0),
  purchase_currency text not null default 'CZK',
  purchase_date date,
  estimated_value numeric(12, 2) check (estimated_value is null or estimated_value >= 0),
  note text,
  created_at timestamptz not null default now(),
  constraint portfolio_items_person_or_custom_name check (
    person_id is not null or custom_person_name is not null
  )
);

create index portfolio_items_user_id_idx on portfolio_items(user_id);
create index portfolio_items_person_id_idx on portfolio_items(person_id);

alter table portfolio_items enable row level security;

create policy "portfolio_items: owner select" on portfolio_items
  for select using (auth.uid() = user_id);
create policy "portfolio_items: owner insert" on portfolio_items
  for insert with check (auth.uid() = user_id);
create policy "portfolio_items: owner update" on portfolio_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "portfolio_items: owner delete" on portfolio_items
  for delete using (auth.uid() = user_id);

-- ── item_photos ──────────────────────────────────────────────────────────
create table item_photos (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references portfolio_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null,
  sort_order integer not null default 0,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index item_photos_item_id_idx on item_photos(item_id);
create index item_photos_user_id_idx on item_photos(user_id);

alter table item_photos enable row level security;

create policy "item_photos: owner select" on item_photos
  for select using (auth.uid() = user_id);
create policy "item_photos: owner insert" on item_photos
  for insert with check (auth.uid() = user_id);
create policy "item_photos: owner update" on item_photos
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "item_photos: owner delete" on item_photos
  for delete using (auth.uid() = user_id);
-- Public display of is_public = true photos is NOT done via a public RLS
-- policy here — see supabase/migrations/0003_storage.sql for why (a private
-- bucket needs signed URLs regardless, generated behind an app-level check).

-- ── autograph_requests ───────────────────────────────────────────────────
create table autograph_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  person_id uuid not null references persons(id) on delete cascade,
  item_type item_type not null,
  sent_at date not null,
  status request_status not null default 'waiting',
  received_at date,
  return_postage_type return_postage_type,
  country text,
  note text,
  created_at timestamptz not null default now(),
  constraint autograph_requests_received_after_sent check (
    received_at is null or received_at >= sent_at
  )
);

create index autograph_requests_user_id_idx on autograph_requests(user_id);
create index autograph_requests_person_id_idx on autograph_requests(person_id);

alter table autograph_requests enable row level security;

create policy "autograph_requests: owner select" on autograph_requests
  for select using (auth.uid() = user_id);
create policy "autograph_requests: owner insert" on autograph_requests
  for insert with check (auth.uid() = user_id);
create policy "autograph_requests: owner update" on autograph_requests
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "autograph_requests: owner delete" on autograph_requests
  for delete using (auth.uid() = user_id);
-- Public aggregate stats (count/median wait/success rate, no user_id, no
-- notes, only when a person has >= 3 records) are exposed through a
-- security-definer function instead of a public SELECT policy — see
-- supabase/migrations/0002_request_stats_function.sql.

-- ── price_reports (table only — import comes later) ─────────────────────
create table price_reports (
  id uuid primary key default gen_random_uuid(),
  person_id uuid not null references persons(id) on delete cascade,
  item_type item_type not null,
  authentication authentication_type not null default 'unverified',
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'CZK',
  sold_at date,
  source_name text not null,
  source_url text not null,
  title text,
  external_image_url text,
  status moderation_status not null default 'pending',
  created_at timestamptz not null default now()
);

create index price_reports_person_id_idx on price_reports(person_id);
create index price_reports_status_idx on price_reports(status);

alter table price_reports enable row level security;

create policy "price_reports: public reads approved" on price_reports
  for select using (status = 'approved');
-- No INSERT/UPDATE policy yet — price import is out of MVP scope; rows are
-- written with the admin (service role) client when that ships.

-- ── content_reports ("Nahlásit") ─────────────────────────────────────────
create table content_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  target_type content_target_type not null,
  target_id uuid not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create index content_reports_reporter_id_idx on content_reports(reporter_id);

alter table content_reports enable row level security;

create policy "content_reports: reporter select own" on content_reports
  for select using (auth.uid() = reporter_id);
create policy "content_reports: reporter insert" on content_reports
  for insert with check (auth.uid() = reporter_id);
-- No update/delete policy — reports are immutable once filed; only the
-- admin (service role) client moderates them.
