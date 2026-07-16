create or replace function public.set_active_lot_bid(
  p_player_id uuid,
  p_team_id uuid,
  p_amount numeric
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
  v_roster_count_after_bid integer;
  v_required_players_after_bid integer;
  v_minimum_bid numeric;
  v_max_bid numeric;
  v_effective_max_bid numeric;
begin
  perform public.require_admin();

  if p_amount is null or p_amount < 0 then
    raise exception 'Bid amount must be 0 or greater';
  end if;

  select * into v_player
  from public.players
  where id = p_player_id
    and status = 'in_bidding'
  for update;

  if not found then
    raise exception 'Bid can be set only for the active lot';
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

  if mod(p_amount, v_increment) <> 0 then
    raise exception 'Bid amount must be a multiple of %', v_increment;
  end if;

  v_minimum_bid := ceil(v_player.base_price / v_increment) * v_increment;

  if p_amount < v_minimum_bid then
    raise exception 'Bid amount must be at least %', v_minimum_bid;
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
  v_max_bid := greatest(
    v_team.purse - v_team.spent - (v_required_players_after_bid * v_default_base_price),
    0
  );
  v_effective_max_bid := least(v_max_bid, 600);

  if p_amount > v_effective_max_bid then
    raise exception 'Maximum bid for % is %', v_team.name, v_effective_max_bid;
  end if;

  update public.players
  set current_bid = p_amount,
      current_team_id = p_team_id
  where id = p_player_id;

  insert into public.bids (player_id, team_id, amount, created_by)
  values (p_player_id, p_team_id, p_amount, auth.uid());
end;
$$;

revoke execute on function public.set_active_lot_bid(uuid, uuid, numeric) from public;
grant execute on function public.set_active_lot_bid(uuid, uuid, numeric) to authenticated;
