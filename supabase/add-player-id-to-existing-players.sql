-- Run this once in Supabase SQL Editor to add player_id values to existing players.
-- This is the visible numeric player ID shown in the app, separate from the UUID id.

alter table public.players
  add column if not exists player_id integer;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'players'
      and column_name = 'player_number'
  ) then
    execute 'update public.players set player_id = player_number where player_id is null';
  end if;
end $$;

with existing_max as (
  select coalesce(max(player_id), 0) as current_max
  from public.players
),
numbered_players as (
  select
    players_to_number.id,
    (
      existing_max.current_max
      + row_number() over (
        order by players_to_number.created_at, players_to_number.id
      )
    )::integer as next_player_id
  from public.players as players_to_number
  cross join existing_max
  where players_to_number.player_id is null
)
update public.players
set player_id = numbered_players.next_player_id
from numbered_players
where public.players.id = numbered_players.id;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'players_player_id_key'
      and conrelid = 'public.players'::regclass
  ) then
    alter table public.players
      add constraint players_player_id_key unique (player_id);
  end if;
end $$;

alter table public.players
  alter column player_id set not null;

alter table public.players
  drop column if exists player_number;

select player_id, name, role, status
from public.players
order by player_id;
