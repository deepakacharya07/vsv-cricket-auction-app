alter table public.players
  drop constraint if exists players_status_check;

alter table public.players
  add constraint players_status_check
  check (status in ('available', 'in_bidding', 'sold', 'unsold', 'not_playing'));

drop function if exists public.add_player(text, text, text, text, integer, numeric, text);
drop function if exists public.add_player(text, text, text, text, integer, numeric, text, text, text);
drop function if exists public.add_player(text, text, text, text, integer, numeric, text, text, text, text);

create or replace function public.add_player(
  p_name text,
  p_role text,
  p_batting_style text,
  p_bowling_style text,
  p_age integer,
  p_base_price numeric,
  p_image_url text,
  p_contact text default null,
  p_jersey_number text default null,
  p_status text default 'available'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_next_player_id integer;
  v_status text;
begin
  perform public.require_admin();

  v_status := coalesce(nullif(p_status, ''), 'available');
  if v_status not in ('available', 'not_playing') then
    raise exception 'New players can only be available or not playing';
  end if;

  lock table public.players in exclusive mode;

  select coalesce(max(player_id), 0) + 1
  into v_next_player_id
  from public.players;

  insert into public.players (
    player_id,
    name,
    role,
    batting_style,
    bowling_style,
    age,
    base_price,
    current_bid,
    image_url,
    contact,
    jersey_number,
    status
  )
  values (
    v_next_player_id,
    p_name,
    p_role,
    p_batting_style,
    p_bowling_style,
    p_age,
    p_base_price,
    p_base_price,
    p_image_url,
    nullif(p_contact, ''),
    nullif(p_jersey_number, ''),
    v_status
  )
  returning id into v_player_id;

  return v_player_id;
end;
$$;

drop function if exists public.update_player(uuid, text, text, text, text, integer, numeric, text);
drop function if exists public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text);
drop function if exists public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text, text);

create or replace function public.update_player(
  p_player_id uuid,
  p_name text,
  p_role text,
  p_batting_style text,
  p_bowling_style text,
  p_age integer,
  p_base_price numeric,
  p_image_url text,
  p_contact text default null,
  p_jersey_number text default null,
  p_status text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player public.players%rowtype;
  v_status text;
begin
  perform public.require_admin();

  if p_role not in ('Batter', 'Bowler', 'All-rounder', 'Wicket keeper') then
    raise exception 'Invalid player role';
  end if;

  if p_age < 16 then
    raise exception 'Player age must be at least 16';
  end if;

  if p_base_price < 0 then
    raise exception 'Base price cannot be negative';
  end if;

  select * into v_player
  from public.players
  where id = p_player_id
  for update;

  if not found then
    raise exception 'Player not found';
  end if;

  v_status := coalesce(nullif(p_status, ''), v_player.status);
  if v_status not in ('available', 'in_bidding', 'sold', 'unsold', 'not_playing') then
    raise exception 'Invalid player status';
  end if;

  if v_player.status in ('in_bidding', 'sold') and v_status <> v_player.status then
    raise exception 'Use auction controls to change active or sold player status';
  end if;

  if v_player.status not in ('in_bidding', 'sold')
     and v_status not in ('available', 'not_playing', v_player.status) then
    raise exception 'Player status can only be set to available or not playing from the player form';
  end if;

  update public.players
  set name = p_name,
      role = p_role,
      batting_style = p_batting_style,
      bowling_style = p_bowling_style,
      age = p_age,
      base_price = p_base_price,
      image_url = p_image_url,
      contact = nullif(p_contact, ''),
      jersey_number = nullif(p_jersey_number, ''),
      status = v_status,
      current_team_id = case
        when v_status in ('available', 'not_playing') then null
        else current_team_id
      end,
      sold_team_id = case
        when v_status in ('available', 'not_playing') then null
        else sold_team_id
      end,
      current_bid = case
        when v_status in ('available', 'not_playing') then p_base_price
        when current_team_id is null and status <> 'sold' then p_base_price
        else greatest(current_bid, p_base_price)
      end
  where id = p_player_id;
end;
$$;

create or replace function public.start_player(p_player_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  if not exists (
    select 1 from public.players
    where id = p_player_id and status = 'available'
  ) then
    raise exception 'Only available players can be started';
  end if;

  update public.players
  set status = 'available',
      current_team_id = null
  where status = 'in_bidding';

  update public.players
  set status = 'in_bidding',
      current_team_id = null,
      current_bid = greatest(current_bid, base_price)
  where id = p_player_id;
end;
$$;

create or replace function public.reset_auction_except_captains(
  p_keep_vice_captains boolean default false
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  with retained_players as (
    select captain_player_id as player_id
    from public.teams
    where captain_player_id is not null
    union
    select vice_captain_player_id
    from public.teams
    where p_keep_vice_captains
      and vice_captain_player_id is not null
  )
  delete from public.bids b
  where not exists (
    select 1
    from retained_players r
    where r.player_id = b.player_id
  );

  with retained_players as (
    select captain_player_id as player_id
    from public.teams
    where captain_player_id is not null
    union
    select vice_captain_player_id
    from public.teams
    where p_keep_vice_captains
      and vice_captain_player_id is not null
  )
  update public.players p
  set status = 'available',
      current_team_id = null,
      sold_team_id = null,
      current_bid = base_price
  where not exists (
    select 1
    from retained_players r
    where r.player_id = p.id
  )
    and p.status <> 'not_playing';

  with retained_players as (
    select captain_player_id as player_id
    from public.teams
    where captain_player_id is not null
    union
    select vice_captain_player_id
    from public.teams
    where p_keep_vice_captains
      and vice_captain_player_id is not null
  )
  update public.teams t
  set spent = coalesce((
    select sum(p.current_bid)
    from public.players p
    join retained_players r on r.player_id = p.id
    where p.status = 'sold'
      and p.sold_team_id = t.id
  ), 0)
  where true;
end;
$$;

revoke execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text, text) from public;
revoke execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text, text) from public;
revoke execute on function public.start_player(uuid) from public;
revoke execute on function public.reset_auction_except_captains(boolean) from public;

grant execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text, text) to authenticated;
grant execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text, text) to authenticated;
grant execute on function public.start_player(uuid) to authenticated;
grant execute on function public.reset_auction_except_captains(boolean) to authenticated;
