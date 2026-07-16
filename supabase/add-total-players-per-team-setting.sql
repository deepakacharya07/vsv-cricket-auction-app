alter table public.auction_settings
  add column if not exists total_players_per_team integer not null default 11;

alter table public.auction_settings
  alter column total_players_per_team set default 11;

do $$
begin
  alter table public.auction_settings
    add constraint auction_settings_total_players_per_team_check
    check (total_players_per_team > 0);
exception
  when duplicate_object then null;
end $$;

drop function if exists public.update_auction_config(numeric, numeric, numeric);

create or replace function public.update_auction_config(
  p_default_base_price numeric,
  p_bid_increment numeric,
  p_team_purse numeric,
  p_total_players_per_team integer
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  if p_default_base_price <= 0 then
    raise exception 'Default base price must be greater than 0';
  end if;

  if p_bid_increment <= 0 then
    raise exception 'Bid increment must be greater than 0';
  end if;

  if p_team_purse <= 0 then
    raise exception 'Team purse must be greater than 0';
  end if;

  if p_total_players_per_team <= 0 then
    raise exception 'Total players per team must be greater than 0';
  end if;

  if exists (
    select 1
    from public.teams
    where spent > p_team_purse
  ) then
    raise exception 'Team purse cannot be less than current spending';
  end if;

  if exists (
    select 1
    from public.teams t
    cross join lateral (
      select count(distinct roster.player_id) as player_count
      from (
        select p.id as player_id
        from public.players p
        where p.sold_team_id = t.id
           or (p.status = 'in_bidding' and p.current_team_id = t.id)
        union all
        select t.captain_player_id
        where t.captain_player_id is not null
        union all
        select t.vice_captain_player_id
        where t.vice_captain_player_id is not null
      ) roster
    ) roster_count
    where roster_count.player_count > p_total_players_per_team
  ) then
    raise exception 'Total players per team cannot be less than current roster count';
  end if;

  insert into public.auction_settings (
    id,
    bid_increment,
    default_base_price,
    total_players_per_team,
    updated_at
  )
  values (
    true,
    p_bid_increment,
    p_default_base_price,
    p_total_players_per_team,
    now()
  )
  on conflict (id)
  do update set bid_increment = excluded.bid_increment,
                default_base_price = excluded.default_base_price,
                total_players_per_team = excluded.total_players_per_team,
                updated_at = excluded.updated_at;

  update public.teams
  set purse = p_team_purse
  where true;
end;
$$;

create or replace function public.place_bid(
  p_player_id uuid,
  p_team_id uuid
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player public.players%rowtype;
  v_team public.teams%rowtype;
  v_increment numeric;
  v_default_base_price numeric;
  v_total_players_per_team integer;
  v_next_amount numeric;
  v_roster_count_after_bid integer;
  v_required_players_after_bid integer;
  v_max_bid numeric;
begin
  perform public.require_admin();

  select * into v_player
  from public.players
  where id = p_player_id and status = 'in_bidding'
  for update;

  if not found then
    raise exception 'Player is not currently open for bidding';
  end if;

  select * into v_team
  from public.teams
  where id = p_team_id
  for update;

  if not found then
    raise exception 'Team not found';
  end if;

  select
    bid_increment,
    default_base_price,
    total_players_per_team
  into
    v_increment,
    v_default_base_price,
    v_total_players_per_team
  from public.auction_settings
  where id = true;

  v_increment := coalesce(v_increment, 50);
  v_default_base_price := coalesce(v_default_base_price, 50);
  v_total_players_per_team := coalesce(v_total_players_per_team, 11);

  if v_player.current_team_id is null then
    v_next_amount := greatest(v_player.current_bid, v_player.base_price);
  else
    v_next_amount := greatest(v_player.current_bid + v_increment, v_player.base_price);
  end if;

  select count(distinct roster.player_id) into v_roster_count_after_bid
  from (
    select id as player_id
    from public.players
    where sold_team_id = p_team_id
       or (status = 'in_bidding' and current_team_id = p_team_id and id <> p_player_id)
    union all
    select p_player_id
    union all
    select captain_player_id
    from public.teams
    where id = p_team_id and captain_player_id is not null
    union all
    select vice_captain_player_id
    from public.teams
    where id = p_team_id and vice_captain_player_id is not null
  ) roster;

  if v_roster_count_after_bid > v_total_players_per_team then
    raise exception 'Team already has the configured total players';
  end if;

  v_required_players_after_bid :=
    greatest(v_total_players_per_team - v_roster_count_after_bid, 0);
  v_max_bid :=
    greatest(v_team.purse - v_team.spent - (v_required_players_after_bid * v_default_base_price), 0);

  if v_next_amount > v_max_bid then
    raise exception 'Team maximum bid is %', v_max_bid;
  end if;

  update public.players
  set current_bid = v_next_amount,
      current_team_id = p_team_id
  where id = p_player_id;

  insert into public.bids (player_id, team_id, amount, created_by)
  values (p_player_id, p_team_id, v_next_amount, auth.uid());
end;
$$;

revoke execute on function public.update_auction_config(numeric, numeric, numeric, integer) from public;
grant execute on function public.update_auction_config(numeric, numeric, numeric, integer) to authenticated;
revoke execute on function public.place_bid(uuid, uuid) from public;
grant execute on function public.place_bid(uuid, uuid) to authenticated;
