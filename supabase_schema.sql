-- ══════════════════════════════════════════════════════════════════════════════
-- SolarAxis Monitor: Supabase Migration Script
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  create type user_role as enum ('admin', 'vendor', 'customer');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create type plant_status as enum ('online', 'offline', 'fault', 'low');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create type alert_type as enum ('critical', 'warning', 'info');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create type ticket_status as enum ('open', 'progress', 'resolved', 'closed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  create type ticket_priority as enum ('low', 'medium', 'high', 'urgent');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABLES

-- PROFILES (linked to Supabase Auth)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'customer',
  full_name text,
  email text,
  phone text,
  avatar_url text,
  vendor_id uuid references profiles(id),
  plant_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PLANTS
create table if not exists plants (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  customer_id uuid references profiles(id),
  vendor_id uuid references profiles(id),
  location text,
  capacity_kw float8 not null default 0,
  inverter_brand text,
  status plant_status default 'online',
  panels_count int,
  install_date date,
  latitude float8,
  longitude float8,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- UNITS (Inverters)
create table if not exists units (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants(id) on delete cascade,
  vendor_id uuid references profiles(id),
  brand text not null,
  model text,
  serial_no text unique not null,
  dongle_no text unique,
  capacity_kw float8 not null,
  connection_type text default 'cloud',
  ip_address text,
  port int default 502,
  slave_id int default 1,
  status text default 'connected',
  last_sync timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- GENERATION DATA
create table if not exists generation (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants(id) on delete cascade,
  date date not null,
  kwh float8 not null default 0,
  peak_kw float8 default 0,
  performance int default 100,
  unique(plant_id, date)
);

-- ALERTS
create table if not exists alerts (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants(id) on delete cascade,
  vendor_id uuid references profiles(id),
  type alert_type not null default 'info',
  category text,
  title text not null,
  message text,
  resolved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ══════════════════════════════════════════════════════════════════════════════
-- 4. ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════════════════════

-- Enable RLS on all tables
alter table profiles   enable row level security;
alter table plants     enable row level security;
alter table units      enable row level security;
alter table generation enable row level security;
alter table alerts     enable row level security;

-- ── PROFILES ─────────────────────────────────────────────────────────────────

-- Users can read their own profile
create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

-- Admins can read all profiles
create policy "Admins can read all profiles"
  on profiles for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Vendors can read their customers' profiles
create policy "Vendors can read customer profiles"
  on profiles for select
  using (
    vendor_id = auth.uid()
    or exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'vendor'
    )
  );

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

-- Service role / trigger can insert profiles on sign-up
create policy "Enable insert for authenticated users"
  on profiles for insert
  with check (auth.uid() = id);

-- ── PLANTS ───────────────────────────────────────────────────────────────────

-- Vendors see their own plants
create policy "Vendors see own plants"
  on plants for select
  using (vendor_id = auth.uid());

-- Customers see plants assigned to them
create policy "Customers see own plants"
  on plants for select
  using (customer_id = auth.uid());

-- Admins see all plants
create policy "Admins see all plants"
  on plants for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Vendors can create plants
create policy "Vendors can create plants"
  on plants for insert
  with check (vendor_id = auth.uid());

-- Vendors can update their own plants
create policy "Vendors can update own plants"
  on plants for update
  using (vendor_id = auth.uid());

-- Vendors can delete their own plants
create policy "Vendors can delete own plants"
  on plants for delete
  using (vendor_id = auth.uid());

-- ── UNITS ────────────────────────────────────────────────────────────────────

create policy "Vendors see own units"
  on units for select
  using (vendor_id = auth.uid());

create policy "Admins see all units"
  on units for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Vendors can insert units"
  on units for insert
  with check (vendor_id = auth.uid());

create policy "Vendors can update own units"
  on units for update
  using (vendor_id = auth.uid());

-- ── GENERATION ───────────────────────────────────────────────────────────────

create policy "Users see generation for their plants"
  on generation for select
  using (
    exists (
      select 1 from plants pl
      where pl.id = generation.plant_id
        and (pl.vendor_id = auth.uid() or pl.customer_id = auth.uid())
    )
  );

create policy "Admins see all generation"
  on generation for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Vendors can insert generation"
  on generation for insert
  with check (
    exists (
      select 1 from plants pl
      where pl.id = generation.plant_id
        and pl.vendor_id = auth.uid()
    )
  );

-- ── ALERTS ───────────────────────────────────────────────────────────────────

create policy "Users see alerts for their plants"
  on alerts for select
  using (
    vendor_id = auth.uid()
    or exists (
      select 1 from plants pl
      where pl.id = alerts.plant_id
        and pl.customer_id = auth.uid()
    )
  );

create policy "Admins see all alerts"
  on alerts for select
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy "Vendors can insert alerts"
  on alerts for insert
  with check (vendor_id = auth.uid());

create policy "Vendors can update own alerts"
  on alerts for update
  using (vendor_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════════════════
-- 5. INDEXES for performance
-- ══════════════════════════════════════════════════════════════════════════════

create index if not exists idx_plants_vendor     on plants(vendor_id);
create index if not exists idx_plants_customer   on plants(customer_id);
create index if not exists idx_units_plant       on units(plant_id);
create index if not exists idx_units_vendor      on units(vendor_id);
create index if not exists idx_generation_plant  on generation(plant_id);
create index if not exists idx_generation_date   on generation(date);
create index if not exists idx_alerts_plant      on alerts(plant_id);
create index if not exists idx_alerts_vendor     on alerts(vendor_id);
create index if not exists idx_alerts_resolved   on alerts(resolved);
create index if not exists idx_profiles_role     on profiles(role);

-- ══════════════════════════════════════════════════════════════════════════════
-- 6. AUTO-CREATE PROFILE ON SIGN-UP (Trigger)
-- ══════════════════════════════════════════════════════════════════════════════

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  return new;
end;
$$;

-- Drop existing trigger if any, then create
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ══════════════════════════════════════════════════════════════════════════════
-- 7. ENABLE REALTIME for live dashboard updates
-- ══════════════════════════════════════════════════════════════════════════════

alter publication supabase_realtime add table plants;
alter publication supabase_realtime add table alerts;
alter publication supabase_realtime add table generation;
