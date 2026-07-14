-- Adds contact and jersey number fields to players, updates player RPCs,
-- and imports players from cricket-player-details.xlsx.
-- Source workbook: /Users/deemn/Documents/Deepak/VSV/vishwaparva-2026/cricket-player-details.xlsx
-- Source list used for import values: /Users/deemn/Documents/Deepak/VSV/vishwaparva-2026/cricket-player-names

alter table public.players
  add column if not exists contact text;

alter table public.players
  add column if not exists jersey_number text;

alter table public.players enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'players'
      and policyname = 'Public can view players'
  ) then
    create policy "Public can view players"
      on public.players for select
      using (true);
  end if;
end $$;

drop function if exists public.add_player(text, text, text, text, integer, numeric, text);

create or replace function public.add_player(
  p_name text,
  p_role text,
  p_batting_style text,
  p_bowling_style text,
  p_age integer,
  p_base_price numeric,
  p_image_url text,
  p_contact text default null,
  p_jersey_number text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_player_id uuid;
  v_next_player_id integer;
begin
  perform public.require_admin();

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
    'available'
  )
  returning id into v_player_id;

  return v_player_id;
end;
$$;

drop function if exists public.update_player(uuid, text, text, text, text, integer, numeric, text);

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
  p_jersey_number text default null
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
      contact = nullif(p_contact, ''),
      jersey_number = nullif(p_jersey_number, ''),
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

revoke execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text) from public;
revoke execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text) from public;

grant execute on function public.add_player(text, text, text, text, integer, numeric, text, text, text) to authenticated;
grant execute on function public.update_player(uuid, text, text, text, text, integer, numeric, text, text, text) to authenticated;

with source_players (sort_order, name, batting, bowling, jersey_number, contact) as (
  values
  (1, 'Vinith kumar K N', 'Yes', 'Yes', null, '8050306041'),
  (2, 'laxmisha', 'Yes', 'Yes', null, '7899815245'),
  (3, 'koushal V acharya', 'Yes', 'Yes', null, '8088175096'),
  (4, 'Deepak MN', 'Yes', 'No', null, '9986724373'),
  (5, 'Mohan', 'Yes', 'Yes', '09', '9900788889'),
  (6, 'Pavan acharya neerchal', 'Yes', 'Yes', '18', '8921754138'),
  (7, 'Bharathesh', 'No', 'Yes', '03', '7892325351'),
  (8, 'Mahesh Acharya', 'Yes', 'Yes', '21', '8970924789'),
  (9, 'Abhijith B', 'Yes', 'Yes', null, '7907213732'),
  (10, 'Lavanandha B M', 'Yes', 'Yes', '45', '8921161011'),
  (11, 'poorna', 'Yes', 'Yes', '30', '7996774664'),
  (12, 'Nirmith KP', 'Yes', 'Yes', '01', '8495867407'),
  (13, 'Lakshmeesha', 'Yes', 'Yes', '08', '7996801412'),
  (14, 'Goutham', 'Yes', 'No', '22', '9496593559'),
  (15, 'Alok', 'Yes', 'Yes', '06', '7760763672'),
  (16, 'Gowrish', 'Yes', 'No', '04', '9036637503'),
  (17, 'Avinash B M', 'Yes', 'Yes', '28', '7411051294'),
  (18, 'Santhosh K', 'Yes', 'Yes', '29', '9066622762'),
  (19, 'Keerthesh', 'Yes', 'Yes', '20', '8086290277'),
  (20, 'Manoj K', 'Yes', 'Yes', '07', '9645701355'),
  (21, 'Thushar', 'Yes', 'Yes', '01', '9947776953'),
  (22, 'Yathin Kumar', 'Yes', 'Yes', '12', '9633964639'),
  (23, 'Sadashiv', 'Yes', 'Yes', '24', '9731888744'),
  (24, 'Sachin', 'Yes', 'Yes', '21', '9886001925'),
  (25, 'Kiran raj', 'Yes', 'Yes', '77', '9995408597'),
  (26, 'Sachin', 'Yes', 'Yes', '10', '8217098750'),
  (27, 'Yogiraj KT', 'Yes', 'Yes', '16', '7411012323'),
  (28, 'Shravan v acharya', 'Yes', 'Yes', '07', '9739892978'),
  (29, 'Prasanna B', 'Yes', 'Yes', '45', '7019533764'),
  (30, 'guruprasad', 'Yes', 'Yes', '04', '9449284148'),
  (31, 'Yathindra', 'Yes', 'No', '45', '9611360934'),
  (32, 'Chinthan', 'Yes', 'Yes', '18', '7012496751'),
  (33, 'Shravan', 'Yes', 'Yes', '21', '8722037655'),
  (34, 'Deekshith', 'Yes', 'No', '14', '7676812416'),
  (35, 'Dhanush N', 'Yes', 'Yes', '07', '6362812906'),
  (36, 'Praveen', 'Yes', 'Yes', '07', '9742064776'),
  (37, 'Pranvith', 'Yes', 'Yes', '26', '9742064776'),
  (38, 'Charan', 'Yes', 'Yes', '05', '9741312222'),
  (39, 'Prakash M acharya', 'Yes', 'Yes', '21', '9343351121'),
  (40, 'Devaamsh g acharya', 'Yes', 'Yes', '13', '9844212625'),
  (41, 'Varun', 'Yes', 'Yes', '99', '90711 47224'),
  (42, 'Sharath', 'Yes', 'Yes', '04', '9986894932'),
  (43, 'Roopesh A', 'Yes', 'No', '13', '7338628799'),
  (44, 'Karthi', 'Yes', 'No', '11', '9895936556'),
  (45, 'Adithya K', 'No', 'Yes', '05', '8129770820'),
  (46, 'Karthikeya', 'Yes', 'Yes', '07', '9778358176'),
  (47, 'K. Y. Sunil Kumar', 'Yes', 'Yes', '05', '8123369551'),
  (48, 'THEJAS', 'No', 'Yes', '46', '9632232792'),
  (49, 'yajnik acharya', 'No', 'Yes', '02', '9480973808'),
  (50, 'Vamshi Vivaan', 'Yes', 'Yes', '24', '9686398969'),
  (51, 'Naveen Deep', 'Yes', 'No', '12', '7353126832'),
  (52, 'Karthik Acharya', 'Yes', 'Yes', '29', '9844599888'),
  (53, 'Vaishaka N', 'Yes', 'No', '08', '8884050905'),
  (54, 'Naveen Chandra', 'Yes', 'No', '15', '9986599941'),
  (55, 'Akash K', 'Yes', 'Yes', '04', '7411899250'),
  (56, 'Kishan', 'Yes', 'Yes', '27', '9844466242'),
  (57, 'Hithesh', 'No', 'Yes', '11', '9686922074')
),
players_to_insert as (
  select
    source_players.*,
    case
      when lower(batting) = 'yes' and lower(bowling) = 'yes' then 'All-rounder'
      when lower(batting) = 'yes' then 'Batter'
      when lower(bowling) = 'yes' then 'Bowler'
      else 'Batter'
    end as role
  from source_players
  where not exists (
    select 1
    from public.players existing_player
    where lower(existing_player.name) = lower(source_players.name)
      and coalesce(existing_player.contact, '') = coalesce(source_players.contact, '')
  )
),
numbered_players as (
  select
    (select coalesce(max(player_id), 0) from public.players)
      + row_number() over (order by sort_order) as player_id,
    *
  from players_to_insert
)
insert into public.players (
  player_id,
  name,
  role,
  batting_style,
  bowling_style,
  age,
  base_price,
  current_bid,
  contact,
  jersey_number,
  status,
  image_url,
  created_at
)
select
  player_id,
  name,
  role,
  'Right hand bat',
  'Right arm fast',
  24,
  50,
  50,
  nullif(contact, ''),
  nullif(jersey_number, ''),
  'available',
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80',
  now() + make_interval(secs => (sort_order - 1))
from numbered_players
order by sort_order;
