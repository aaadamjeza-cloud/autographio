-- Item detail: acquisition method/quantity/date, plus sale & trade listing.
-- portfolio_items has had none of these since 0001_init.sql — this is
-- purely additive, no data migration needed for existing rows (they just
-- read back as null/default).
--
-- Review before running; this is not applied automatically.

create type acquisition_method as enum ('mail', 'in_person', 'purchase', 'trade');
create type trade_status as enum ('offered', 'negotiating', 'completed');

alter table portfolio_items
  add column acquisition_method acquisition_method,
  add column quantity integer not null default 1 check (quantity >= 1),
  add column acquired_at date,
  add column for_sale boolean not null default false,
  add column for_trade boolean not null default false,
  add column asking_price numeric(12, 2) check (asking_price is null or asking_price >= 0),
  add column trade_wanted text,
  add column trade_status trade_status,
  add column trade_contact text;

-- No RLS changes needed — the existing owner-only policies (0001, rewritten
-- for Clerk in 0005) apply to the whole row, new columns included.
