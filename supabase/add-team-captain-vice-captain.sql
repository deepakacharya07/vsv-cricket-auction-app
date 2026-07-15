begin;

alter table public.teams
  add column if not exists captain_player_id uuid;

alter table public.teams
  add column if not exists vice_captain_player_id uuid;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_captain_player_id_fkey'
      and conrelid = 'public.teams'::regclass
  ) then
    alter table public.teams
      add constraint teams_captain_player_id_fkey
      foreign key (captain_player_id)
      references public.players(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_vice_captain_player_id_fkey'
      and conrelid = 'public.teams'::regclass
  ) then
    alter table public.teams
      add constraint teams_vice_captain_player_id_fkey
      foreign key (vice_captain_player_id)
      references public.players(id)
      on delete set null;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'teams_captain_vice_captain_distinct_check'
      and conrelid = 'public.teams'::regclass
  ) then
    alter table public.teams
      add constraint teams_captain_vice_captain_distinct_check
      check (
        captain_player_id is null
        or vice_captain_player_id is null
        or captain_player_id <> vice_captain_player_id
      );
  end if;
end $$;

comment on column public.teams.captain_player_id is 'Player selected as the team captain.';
comment on column public.teams.vice_captain_player_id is 'Player selected as the team vice captain.';

create index if not exists teams_captain_player_idx
  on public.teams(captain_player_id);

create index if not exists teams_vice_captain_player_idx
  on public.teams(vice_captain_player_id);

create or replace function public.set_team_captains(
  p_team_id uuid,
  p_captain_player_id uuid default null,
  p_vice_captain_player_id uuid default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  if (
    p_captain_player_id is not null
    and p_vice_captain_player_id is not null
    and p_captain_player_id = p_vice_captain_player_id
  ) then
    raise exception 'Captain and vice captain must be different players';
  end if;

  update public.teams
  set captain_player_id = p_captain_player_id,
      vice_captain_player_id = p_vice_captain_player_id
  where id = p_team_id;

  if not found then
    raise exception 'Team not found';
  end if;
end;
$$;

revoke execute on function public.set_team_captains(uuid, uuid, uuid) from public;
grant execute on function public.set_team_captains(uuid, uuid, uuid) to authenticated;

commit;
