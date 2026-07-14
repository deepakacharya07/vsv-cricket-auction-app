create extension if not exists pgcrypto;

create table if not exists public.auction_settings (
  id boolean primary key default true check (id),
  bid_increment numeric not null default 50 check (bid_increment > 0),
  default_base_price numeric not null default 50 check (default_base_price > 0),
  updated_at timestamptz not null default now()
);

alter table public.auction_settings
  add column if not exists default_base_price numeric not null default 50;

alter table public.auction_settings
  alter column bid_increment set default 50,
  alter column default_base_price set default 50;

do $$
begin
  alter table public.auction_settings
    add constraint auction_settings_default_base_price_check
    check (default_base_price > 0);
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
  name text not null,
  role text not null check (
    role in ('Batter', 'Bowler', 'All-rounder', 'Wicket keeper')
  ),
  batting_style text not null,
  bowling_style text not null,
  age integer not null check (age >= 16),
  base_price numeric not null check (base_price >= 0),
  current_bid numeric not null default 0 check (current_bid >= 0),
  current_team_id uuid references public.teams(id),
  sold_team_id uuid references public.teams(id),
  status text not null default 'available' check (
    status in ('available', 'in_bidding', 'sold', 'unsold')
  ),
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  team_id uuid not null references public.teams(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create index if not exists players_status_idx on public.players(status);
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

create or replace function public.add_player(
  p_name text,
  p_role text,
  p_batting_style text,
  p_bowling_style text,
  p_age integer,
  p_base_price numeric,
  p_image_url text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
begin
  perform public.require_admin();

  insert into public.players (
    name,
    role,
    batting_style,
    bowling_style,
    age,
    base_price,
    current_bid,
    image_url,
    status
  )
  values (
    p_name,
    p_role,
    p_batting_style,
    p_bowling_style,
    p_age,
    p_base_price,
    p_base_price,
    p_image_url,
    'available'
  )
  returning id into v_player_id;

  return v_player_id;
end;
$$;

create or replace function public.update_player(
  p_player_id uuid,
  p_name text,
  p_role text,
  p_batting_style text,
  p_bowling_style text,
  p_age integer,
  p_base_price numeric,
  p_image_url text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
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

  update public.players
  set name = p_name,
      role = p_role,
      batting_style = p_batting_style,
      bowling_style = p_bowling_style,
      age = p_age,
      base_price = p_base_price,
      image_url = p_image_url,
      current_bid = case
        when current_team_id is null and status <> 'sold' then p_base_price
        else greatest(current_bid, p_base_price)
      end
  where id = p_player_id;

  if not found then
    raise exception 'Player not found';
  end if;
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
    where id = p_player_id and status <> 'sold'
  ) then
    raise exception 'Player is not available to start';
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
  v_next_amount numeric;
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

  select bid_increment into v_increment
  from public.auction_settings
  where id = true;

  if v_player.current_team_id is null then
    v_next_amount := greatest(v_player.current_bid, v_player.base_price);
  else
    v_next_amount := greatest(v_player.current_bid + v_increment, v_player.base_price);
  end if;

  if v_team.purse - v_team.spent < v_next_amount then
    raise exception 'Team purse is not enough for this bid';
  end if;

  update public.players
  set current_bid = v_next_amount,
      current_team_id = p_team_id
  where id = p_player_id;

  insert into public.bids (player_id, team_id, amount, created_by)
  values (p_player_id, p_team_id, v_next_amount, auth.uid());
end;
$$;

create or replace function public.update_auction_config(
  p_default_base_price numeric,
  p_bid_increment numeric,
  p_team_purse numeric
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

  if exists (
    select 1
    from public.teams
    where spent > p_team_purse
  ) then
    raise exception 'Team purse cannot be less than current spending';
  end if;

  insert into public.auction_settings (
    id,
    bid_increment,
    default_base_price,
    updated_at
  )
  values (
    true,
    p_bid_increment,
    p_default_base_price,
    now()
  )
  on conflict (id)
  do update set bid_increment = excluded.bid_increment,
                default_base_price = excluded.default_base_price,
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

  insert into public.auction_settings (id, bid_increment, default_base_price, updated_at)
  values (true, 50, 50, now())
  on conflict (id)
  do update set bid_increment = excluded.bid_increment,
                default_base_price = excluded.default_base_price,
                updated_at = excluded.updated_at;

  insert into public.teams (id, name, owner, purse, spent, color, logo_url, created_at)
  values
    ('00000000-0000-0000-0000-000000000101', 'VSV Kings', 'Arjun Mehta', 5000, 0, '#176b48', '', now()),
    ('00000000-0000-0000-0000-000000000102', 'Coastal Strikers', 'Nisha Rao', 5000, 0, '#c7511f', '', now() + interval '1 second'),
    ('00000000-0000-0000-0000-000000000103', 'Metro Titans', 'Vikram Shah', 5000, 0, '#3867a6', '', now() + interval '2 seconds'),
    ('00000000-0000-0000-0000-000000000104', 'Hill Rangers', 'Kabir Khan', 5000, 0, '#8a3ffc', '', now() + interval '3 seconds'),
    ('00000000-0000-0000-0000-000000000105', 'Desert Falcons', 'Meera Joshi', 5000, 0, '#b7791f', '', now() + interval '4 seconds'),
    ('00000000-0000-0000-0000-000000000106', 'City Challengers', 'Ravi Nair', 5000, 0, '#0f766e', '', now() + interval '5 seconds');

  insert into public.players (
    id,
    name,
    role,
    batting_style,
    bowling_style,
    age,
    base_price,
    current_bid,
    current_team_id,
    status,
    image_url,
    created_at
  )
  values
    ('00000000-0000-0000-0000-000000000201', 'Aryan Menon', 'Batter', 'Right hand bat', 'Right arm off break', 25, 50, 150, '00000000-0000-0000-0000-000000000101', 'in_bidding', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80', now()),
    ('00000000-0000-0000-0000-000000000202', 'Rohan Iyer', 'All-rounder', 'Left hand bat', 'Left arm orthodox', 27, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80', now() + interval '1 second'),
    ('00000000-0000-0000-0000-000000000203', 'Samar Gill', 'Bowler', 'Right hand bat', 'Right arm fast', 22, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80', now() + interval '2 seconds'),
    ('00000000-0000-0000-0000-000000000204', 'Kunal Desai', 'Wicket keeper', 'Right hand bat', 'Wicket keeper', 24, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80', now() + interval '3 seconds'),
    ('00000000-0000-0000-0000-000000000205', 'Dev Sharma', 'All-rounder', 'Right hand bat', 'Right arm leg break', 29, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', now() + interval '4 seconds'),
    ('00000000-0000-0000-0000-000000000206', 'Nikhil Verma', 'Bowler', 'Left hand bat', 'Left arm fast', 21, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80', now() + interval '5 seconds'),
    ('00000000-0000-0000-0000-000000000207', 'Manav Rao', 'Batter', 'Right hand bat', 'Right arm medium', 23, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80', now() + interval '6 seconds'),
    ('00000000-0000-0000-0000-000000000208', 'Ishaan Patel', 'Bowler', 'Left hand bat', 'Left arm fast', 26, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80', now() + interval '7 seconds'),
    ('00000000-0000-0000-0000-000000000209', 'Aditya Nair', 'Wicket keeper', 'Right hand bat', 'Wicket keeper', 28, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80', now() + interval '8 seconds'),
    ('00000000-0000-0000-0000-000000000210', 'Varun Shetty', 'All-rounder', 'Right hand bat', 'Right arm fast medium', 30, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', now() + interval '9 seconds'),
    ('00000000-0000-0000-0000-000000000211', 'Pranav Kumar', 'Batter', 'Left hand bat', 'Right arm off break', 24, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80', now() + interval '10 seconds'),
    ('00000000-0000-0000-0000-000000000212', 'Harsh Vyas', 'Bowler', 'Right hand bat', 'Right arm leg break', 22, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80', now() + interval '11 seconds');

  insert into public.bids (id, player_id, team_id, amount, created_at)
  values
    ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 150, now()),
    ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', 100, now() - interval '1 minute');
end;
$$;

insert into public.auction_settings (id, bid_increment, default_base_price)
values (true, 50, 50)
on conflict (id) do nothing;

insert into public.teams (id, name, owner, purse, spent, color, logo_url, created_at)
values
  ('00000000-0000-0000-0000-000000000101', 'VSV Kings', 'Arjun Mehta', 5000, 0, '#176b48', '', now()),
  ('00000000-0000-0000-0000-000000000102', 'Coastal Strikers', 'Nisha Rao', 5000, 0, '#c7511f', '', now() + interval '1 second'),
  ('00000000-0000-0000-0000-000000000103', 'Metro Titans', 'Vikram Shah', 5000, 0, '#3867a6', '', now() + interval '2 seconds'),
  ('00000000-0000-0000-0000-000000000104', 'Hill Rangers', 'Kabir Khan', 5000, 0, '#8a3ffc', '', now() + interval '3 seconds'),
  ('00000000-0000-0000-0000-000000000105', 'Desert Falcons', 'Meera Joshi', 5000, 0, '#b7791f', '', now() + interval '4 seconds'),
  ('00000000-0000-0000-0000-000000000106', 'City Challengers', 'Ravi Nair', 5000, 0, '#0f766e', '', now() + interval '5 seconds')
on conflict (id) do nothing;

insert into public.players (
  id,
  name,
  role,
  batting_style,
  bowling_style,
  age,
  base_price,
  current_bid,
  current_team_id,
  status,
  image_url,
  created_at
)
values
  ('00000000-0000-0000-0000-000000000201', 'Aryan Menon', 'Batter', 'Right hand bat', 'Right arm off break', 25, 50, 150, '00000000-0000-0000-0000-000000000101', 'in_bidding', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80', now()),
  ('00000000-0000-0000-0000-000000000202', 'Rohan Iyer', 'All-rounder', 'Left hand bat', 'Left arm orthodox', 27, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80', now() + interval '1 second'),
  ('00000000-0000-0000-0000-000000000203', 'Samar Gill', 'Bowler', 'Right hand bat', 'Right arm fast', 22, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80', now() + interval '2 seconds'),
  ('00000000-0000-0000-0000-000000000204', 'Kunal Desai', 'Wicket keeper', 'Right hand bat', 'Wicket keeper', 24, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80', now() + interval '3 seconds'),
  ('00000000-0000-0000-0000-000000000205', 'Dev Sharma', 'All-rounder', 'Right hand bat', 'Right arm leg break', 29, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', now() + interval '4 seconds'),
  ('00000000-0000-0000-0000-000000000206', 'Nikhil Verma', 'Bowler', 'Left hand bat', 'Left arm fast', 21, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80', now() + interval '5 seconds'),
  ('00000000-0000-0000-0000-000000000207', 'Manav Rao', 'Batter', 'Right hand bat', 'Right arm medium', 23, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80', now() + interval '6 seconds'),
  ('00000000-0000-0000-0000-000000000208', 'Ishaan Patel', 'Bowler', 'Left hand bat', 'Left arm fast', 26, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593341646782-e0b495cff86d?auto=format&fit=crop&w=900&q=80', now() + interval '7 seconds'),
  ('00000000-0000-0000-0000-000000000209', 'Aditya Nair', 'Wicket keeper', 'Right hand bat', 'Wicket keeper', 28, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=900&q=80', now() + interval '8 seconds'),
  ('00000000-0000-0000-0000-000000000210', 'Varun Shetty', 'All-rounder', 'Right hand bat', 'Right arm fast medium', 30, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80', now() + interval '9 seconds'),
  ('00000000-0000-0000-0000-000000000211', 'Pranav Kumar', 'Batter', 'Left hand bat', 'Right arm off break', 24, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=900&q=80', now() + interval '10 seconds'),
  ('00000000-0000-0000-0000-000000000212', 'Harsh Vyas', 'Bowler', 'Right hand bat', 'Right arm leg break', 22, 50, 50, null, 'available', 'https://images.unsplash.com/photo-1593766788306-28561086694e?auto=format&fit=crop&w=900&q=80', now() + interval '11 seconds')
on conflict (id) do nothing;

insert into public.bids (id, player_id, team_id, amount, created_at)
values
  ('00000000-0000-0000-0000-000000000302', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 150, now()),
  ('00000000-0000-0000-0000-000000000301', '00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000102', 100, now() - interval '1 minute')
on conflict (id) do nothing;

grant usage on schema public to anon, authenticated;
grant select on public.auction_settings to anon, authenticated;
grant select on public.teams to anon, authenticated;
grant select on public.players to anon, authenticated;
grant select on public.bids to anon, authenticated;
grant select on public.admin_users to authenticated;

revoke execute on function public.place_bid(uuid, uuid) from public;
revoke execute on function public.add_player(text, text, text, text, integer, numeric, text) from public;
revoke execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text) from public;
revoke execute on function public.start_player(uuid) from public;
revoke execute on function public.sell_player(uuid) from public;
revoke execute on function public.mark_unsold(uuid) from public;
revoke execute on function public.make_player_available(uuid) from public;
revoke execute on function public.update_auction_config(numeric, numeric, numeric) from public;
revoke execute on function public.add_team(text, text, text, text) from public;
revoke execute on function public.update_team(uuid, text, text, text, text) from public;
revoke execute on function public.delete_team(uuid) from public;
revoke execute on function public.reset_demo_data() from public;

grant execute on function public.place_bid(uuid, uuid) to authenticated;
grant execute on function public.add_player(text, text, text, text, integer, numeric, text) to authenticated;
grant execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text) to authenticated;
grant execute on function public.start_player(uuid) to authenticated;
grant execute on function public.sell_player(uuid) to authenticated;
grant execute on function public.mark_unsold(uuid) to authenticated;
grant execute on function public.make_player_available(uuid) to authenticated;
grant execute on function public.update_auction_config(numeric, numeric, numeric) to authenticated;
grant execute on function public.add_team(text, text, text, text) to authenticated;
grant execute on function public.update_team(uuid, text, text, text, text) to authenticated;
grant execute on function public.delete_team(uuid) to authenticated;
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
