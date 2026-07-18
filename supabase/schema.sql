create extension if not exists pgcrypto;

create table if not exists public.auction_settings (
  id boolean primary key default true check (id),
  bid_increment numeric not null default 50 check (bid_increment > 0),
  default_base_price numeric not null default 50 check (default_base_price > 0),
  total_players_per_team integer not null default 11 check (total_players_per_team > 0),
  updated_at timestamptz not null default now()
);

alter table public.auction_settings
  add column if not exists default_base_price numeric not null default 50;

alter table public.auction_settings
  add column if not exists total_players_per_team integer not null default 11;

alter table public.auction_settings
  alter column bid_increment set default 50,
  alter column default_base_price set default 50,
  alter column total_players_per_team set default 11;

do $$
begin
  alter table public.auction_settings
    add constraint auction_settings_default_base_price_check
    check (default_base_price > 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.auction_settings
    add constraint auction_settings_total_players_per_team_check
    check (total_players_per_team > 0);
exception
  when duplicate_object then null;
end $$;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner text not null,
  purse numeric not null default 5000 check (purse >= 0),
  spent numeric not null default 0 check (spent >= 0),
  color text not null default '#176b48',
  logo_url text not null default '',
  created_at timestamptz not null default now()
);

alter table public.teams
  add column if not exists logo_url text not null default '';

alter table public.teams
  alter column purse set default 5000;

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  player_id integer not null unique,
  name text not null,
  role text not null check (
    role in ('Batter', 'Bowler', 'All-rounder', 'Wicket keeper')
  ),
  batting_style text not null,
  bowling_style text not null,
  age integer not null check (age >= 16),
  contact text,
  jersey_number text,
  base_price numeric not null check (base_price >= 0),
  current_bid numeric not null default 0 check (current_bid >= 0),
  current_team_id uuid references public.teams(id),
  sold_team_id uuid references public.teams(id),
  status text not null default 'available' check (
    status in ('available', 'in_bidding', 'sold', 'unsold', 'not_playing')
  ),
  image_url text not null,
  created_at timestamptz not null default now()
);

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
    (existing_max.current_max + row_number() over (order by players_to_number.created_at, players_to_number.id))::integer as next_player_id
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

alter table public.players
  add column if not exists contact text;

alter table public.players
  add column if not exists jersey_number text;

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

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists players_status_idx on public.players(status);
create index if not exists teams_captain_player_idx
  on public.teams(captain_player_id);
create index if not exists teams_vice_captain_player_idx
  on public.teams(vice_captain_player_id);
create index if not exists bids_player_created_idx
  on public.bids(player_id, created_at desc);

alter table public.auction_settings enable row level security;
alter table public.admin_users enable row level security;
alter table public.teams enable row level security;
alter table public.players enable row level security;
alter table public.bids enable row level security;

drop policy if exists "Public can view settings" on public.auction_settings;
drop policy if exists "Admins can view own admin row" on public.admin_users;
drop policy if exists "Public can view teams" on public.teams;
drop policy if exists "Public can view players" on public.players;
drop policy if exists "Public can view bids" on public.bids;

create policy "Public can view settings"
  on public.auction_settings for select
  using (true);

create policy "Admins can view own admin row"
  on public.admin_users for select
  to authenticated
  using (user_id = auth.uid());

create policy "Public can view teams"
  on public.teams for select
  using (true);

create policy "Public can view players"
  on public.players for select
  using (true);

create policy "Public can view bids"
  on public.bids for select
  using (true);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

create or replace function public.require_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'Admin access required' using errcode = '42501';
  end if;
end;
$$;

drop function if exists public.add_player(text, text, text, text, integer, numeric, text);
drop function if exists public.add_player(text, text, text, text, integer, numeric, text, text, text);

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

drop function if exists public.add_team(text, text, text);
drop function if exists public.update_team(uuid, text, text, text);

create or replace function public.add_team(
  p_name text,
  p_owner text,
  p_color text,
  p_logo_url text default ''
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team_id uuid;
  v_purse numeric;
begin
  perform public.require_admin();

  if nullif(trim(p_name), '') is null then
    raise exception 'Team name is required';
  end if;

  if nullif(trim(p_owner), '') is null then
    raise exception 'Team owner is required';
  end if;

  if p_color is null or p_color !~ '^#[0-9A-Fa-f]{6}$' then
    raise exception 'Team color must be a hex color';
  end if;

  select purse into v_purse
  from public.teams
  order by created_at
  limit 1;

  insert into public.teams (name, owner, purse, spent, color, logo_url)
  values (
    trim(p_name),
    trim(p_owner),
    coalesce(v_purse, 5000),
    0,
    p_color,
    coalesce(nullif(trim(p_logo_url), ''), '')
  )
  returning id into v_team_id;

  return v_team_id;
end;
$$;

create or replace function public.update_team(
  p_team_id uuid,
  p_name text,
  p_owner text,
  p_color text,
  p_logo_url text default ''
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  if nullif(trim(p_name), '') is null then
    raise exception 'Team name is required';
  end if;

  if nullif(trim(p_owner), '') is null then
    raise exception 'Team owner is required';
  end if;

  if p_color is null or p_color !~ '^#[0-9A-Fa-f]{6}$' then
    raise exception 'Team color must be a hex color';
  end if;

  update public.teams
  set name = trim(p_name),
      owner = trim(p_owner),
      color = p_color,
      logo_url = coalesce(nullif(trim(p_logo_url), ''), '')
  where id = p_team_id;

  if not found then
    raise exception 'Team not found';
  end if;
end;
$$;

drop function if exists public.set_team_captains(uuid, uuid, uuid);

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

create or replace function public.delete_team(p_team_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_team public.teams%rowtype;
begin
  perform public.require_admin();

  if (select count(*) from public.teams) <= 1 then
    raise exception 'At least one team is required';
  end if;

  select * into v_team
  from public.teams
  where id = p_team_id
  for update;

  if not found then
    raise exception 'Team not found';
  end if;

  if v_team.spent > 0 then
    raise exception 'Teams with spending cannot be removed';
  end if;

  if exists (select 1 from public.bids where team_id = p_team_id) then
    raise exception 'Teams with bids cannot be removed';
  end if;

  if exists (
    select 1
    from public.players
    where current_team_id = p_team_id
       or sold_team_id = p_team_id
  ) then
    raise exception 'Teams assigned to players cannot be removed';
  end if;

  delete from public.teams
  where id = p_team_id;
end;
$$;

create or replace function public.sell_player(p_player_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player public.players%rowtype;
  v_next_player_id uuid;
begin
  perform public.require_admin();

  select * into v_player
  from public.players
  where id = p_player_id and status = 'in_bidding'
  for update;

  if not found or v_player.current_team_id is null then
    raise exception 'Player cannot be sold without a leading team';
  end if;

  update public.teams
  set spent = spent + v_player.current_bid
  where id = v_player.current_team_id;

  update public.players
  set status = 'sold',
      sold_team_id = v_player.current_team_id
  where id = p_player_id;

  select id into v_next_player_id
  from public.players
  where status = 'available'
  order by created_at
  limit 1;

  if v_next_player_id is not null then
    update public.players
    set status = 'in_bidding',
        current_team_id = null,
        current_bid = greatest(current_bid, base_price)
    where id = v_next_player_id;
  end if;
end;
$$;

create or replace function public.mark_unsold(p_player_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_next_player_id uuid;
begin
  perform public.require_admin();

  update public.players
  set status = 'unsold',
      current_team_id = null,
      current_bid = base_price
  where id = p_player_id and status = 'in_bidding';

  if not found then
    raise exception 'Player is not currently open for bidding';
  end if;

  select id into v_next_player_id
  from public.players
  where status = 'available'
  order by created_at
  limit 1;

  if v_next_player_id is not null then
    update public.players
    set status = 'in_bidding',
        current_team_id = null,
        current_bid = greatest(current_bid, base_price)
    where id = v_next_player_id;
  end if;
end;
$$;

create or replace function public.make_player_available(p_player_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  update public.players
  set status = 'available',
      current_team_id = null,
      current_bid = base_price
  where id = p_player_id and status = 'in_bidding';

  if not found then
    raise exception 'Player is not currently open for bidding';
  end if;

  delete from public.bids
  where player_id = p_player_id;
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

create or replace function public.reset_demo_data()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.require_admin();

  delete from public.bids
  where true;

  delete from public.players
  where true;

  delete from public.teams
  where true;

  insert into public.auction_settings (
    id,
    bid_increment,
    default_base_price,
    total_players_per_team,
    updated_at
  )
  values (true, 50, 50, 11, now())
  on conflict (id)
  do update set bid_increment = excluded.bid_increment,
                default_base_price = excluded.default_base_price,
                total_players_per_team = excluded.total_players_per_team,
                updated_at = excluded.updated_at;

  insert into public.teams (id, name, owner, purse, spent, color, logo_url, created_at)
  values
    ('00000000-0000-0000-0000-000000000101', 'VSV Kings', 'Arjun Mehta', 5000, 0, '#176b48', '', now()),
    ('00000000-0000-0000-0000-000000000102', 'Coastal Strikers', 'Nisha Rao', 5000, 0, '#c7511f', '', now() + interval '1 second'),
    ('00000000-0000-0000-0000-000000000103', 'Metro Titans', 'Vikram Shah', 5000, 0, '#3867a6', '', now() + interval '2 seconds'),
    ('00000000-0000-0000-0000-000000000104', 'Hill Rangers', 'Kabir Khan', 5000, 0, '#8a3ffc', '', now() + interval '3 seconds'),
    ('00000000-0000-0000-0000-000000000105', 'Desert Falcons', 'Meera Joshi', 5000, 0, '#b7791f', '', now() + interval '4 seconds'),
    ('00000000-0000-0000-0000-000000000106', 'City Challengers', 'Ravi Nair', 5000, 0, '#0f766e', '', now() + interval '5 seconds');

end;
$$;

insert into public.auction_settings (
  id,
  bid_increment,
  default_base_price,
  total_players_per_team
)
values (true, 50, 50, 11)
on conflict (id) do nothing;

grant usage on schema public to anon, authenticated;
grant select on public.auction_settings to anon, authenticated;
grant select on public.teams to anon, authenticated;
grant select on public.players to anon, authenticated;
grant select on public.bids to anon, authenticated;
grant select on public.admin_users to authenticated;

revoke execute on function public.place_bid(uuid, uuid) from public;
revoke execute on function public.set_active_lot_bid(uuid, uuid, numeric) from public;
revoke execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text, text) from public;
revoke execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text, text) from public;
revoke execute on function public.start_player(uuid) from public;
revoke execute on function public.sell_player(uuid) from public;
revoke execute on function public.mark_unsold(uuid) from public;
revoke execute on function public.make_player_available(uuid) from public;
revoke execute on function public.update_auction_config(numeric, numeric, numeric, integer) from public;
revoke execute on function public.add_team(text, text, text, text) from public;
revoke execute on function public.update_team(uuid, text, text, text, text) from public;
revoke execute on function public.set_team_captains(uuid, uuid, uuid) from public;
revoke execute on function public.delete_team(uuid) from public;
revoke execute on function public.reset_auction_except_captains(boolean) from public;
revoke execute on function public.reset_demo_data() from public;

grant execute on function public.place_bid(uuid, uuid) to authenticated;
grant execute on function public.set_active_lot_bid(uuid, uuid, numeric) to authenticated;
grant execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text, text) to authenticated;
grant execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text, text) to authenticated;
grant execute on function public.start_player(uuid) to authenticated;
grant execute on function public.sell_player(uuid) to authenticated;
grant execute on function public.mark_unsold(uuid) to authenticated;
grant execute on function public.make_player_available(uuid) to authenticated;
grant execute on function public.update_auction_config(numeric, numeric, numeric, integer) to authenticated;
grant execute on function public.add_team(text, text, text, text) to authenticated;
grant execute on function public.update_team(uuid, text, text, text, text) to authenticated;
grant execute on function public.set_team_captains(uuid, uuid, uuid) to authenticated;
grant execute on function public.delete_team(uuid) to authenticated;
grant execute on function public.reset_auction_except_captains(boolean) to authenticated;
grant execute on function public.reset_demo_data() to authenticated;

alter table public.auction_settings replica identity full;
alter table public.teams replica identity full;
alter table public.players replica identity full;
alter table public.bids replica identity full;

do $$
begin
  alter publication supabase_realtime add table public.auction_settings;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.teams;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.players;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.bids;
exception
  when duplicate_object then null;
end $$;

notify pgrst, 'reload schema';
