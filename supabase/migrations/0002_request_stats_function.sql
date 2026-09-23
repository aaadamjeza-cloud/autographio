-- Public, privacy-safe aggregate stats for a person's autograph requests.
-- Returns only counts/medians — never user_id, never notes — and only once
-- a person has at least 3 resolved (non-"waiting") requests, so a single
-- collector's data is never individually identifiable.
--
-- SECURITY DEFINER so it can read across all users' autograph_requests rows
-- (RLS on that table restricts SELECT to the owner) while only ever
-- returning the aggregate below. `search_path` is pinned to prevent the
-- classic security-definer hijack (a caller-controlled search_path pointing
-- a called object at an attacker's function/table of the same name), and
-- EXECUTE is revoked from PUBLIC and re-granted only to anon/authenticated
-- — no broader role gets to call it than the app actually needs.

create or replace function public.get_person_request_stats(p_person_id uuid)
returns table (
  total_count integer,
  success_rate numeric,
  median_wait_days numeric,
  min_wait_days integer,
  max_wait_days integer
)
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_total integer;
begin
  select count(*) into v_total
  from autograph_requests
  where person_id = p_person_id
    and status <> 'waiting';

  if v_total < 3 then
    return;
  end if;

  return query
  select
    v_total,
    round(
      100.0 * count(*) filter (where status = 'received') / nullif(count(*), 0),
      1
    ),
    percentile_cont(0.5) within group (order by (received_at - sent_at))
      filter (where received_at is not null),
    min(received_at - sent_at) filter (where received_at is not null),
    max(received_at - sent_at) filter (where received_at is not null)
  from autograph_requests
  where person_id = p_person_id
    and status <> 'waiting';
end;
$$;

revoke all on function public.get_person_request_stats(uuid) from public;
grant execute on function public.get_person_request_stats(uuid) to anon, authenticated;
