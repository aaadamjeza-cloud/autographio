-- Display names are reserved forever once used, and can only be changed a
-- limited number of times after the initial pick — see chat: "kdyz budeme
-- mit nejaky username nemuzeme ho znova pouzit a muze jit 3x zmenit v
-- nastaveni". Enforced with a trigger (not app-code checks) so it applies
-- uniformly no matter which code path sets profiles.display_name —
-- onboarding's initial insert and the settings page's update both go
-- through the same guard automatically.

alter table profiles add column display_name_changes integer not null default 0;

-- Append-only ledger of every display_name ever claimed, current or
-- retired. Deliberately has no foreign key to profiles: deleting an
-- account must not free up the names it used, so this table outlives the
-- profile row on purpose. name_key (lower/trimmed) is what actually
-- enforces "nobody, ever again, including the original owner" — a plain
-- unique constraint on profiles.display_name would only stop two people
-- holding the same name at once, not stop it being recycled after someone
-- moves on from it.
create table display_name_history (
  name_key text primary key,
  name text not null,
  profile_id uuid not null,
  created_at timestamptz not null default now()
);

alter table display_name_history enable row level security;
-- No policies at all, by design — this table is only ever written by the
-- trigger function below (SECURITY DEFINER, so it bypasses RLS) and is not
-- meant to be queried directly by client code in any case.

create or replace function public.enforce_display_name_history()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_key text := lower(trim(new.display_name));
begin
  if trim(new.display_name) = '' then
    raise exception 'display name cannot be empty';
  end if;

  if tg_op = 'UPDATE' then
    if old.display_name = new.display_name then
      -- Nothing about the name actually changed (e.g. only
      -- show_name_on_photos was toggled) — don't touch history or the
      -- change counter for that.
      return new;
    end if;
    if new.display_name_changes is distinct from old.display_name_changes then
      raise exception 'display_name_changes is managed automatically and cannot be set directly';
    end if;
    if old.display_name_changes >= 3 then
      raise exception 'display name change limit reached (3 changes max)';
    end if;
    new.display_name_changes := old.display_name_changes + 1;
  end if;

  if exists (select 1 from display_name_history where name_key = v_key) then
    raise exception 'display name already taken';
  end if;

  insert into display_name_history (name_key, name, profile_id) values (v_key, trim(new.display_name), new.id);
  new.display_name := trim(new.display_name);
  return new;
end;
$$;

create trigger profiles_display_name_history
  before insert or update of display_name on profiles
  for each row execute function public.enforce_display_name_history();
