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

revoke execute on function public.reset_auction_except_captains(boolean) from public;
grant execute on function public.reset_auction_except_captains(boolean) to authenticated;
