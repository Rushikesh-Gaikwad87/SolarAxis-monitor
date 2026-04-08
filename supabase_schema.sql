-- SolarAxis Monitor: Supabase Migration Script

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. ENUMS
create type user_role as enum ('admin', 'vendor', 'customer');
create type plant_status as enum ('online', 'offline', 'fault', 'low');
create type alert_type as enum ('critical', 'warning', 'info');
create type ticket_status as enum ('open', 'progress', 'resolved', 'closed');
create type ticket_priority as enum ('low', 'medium', 'high', 'urgent');

-- 3. TABLES

-- USERS (Supabase Auth handles Auth, we store profile)
create table profiles (
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
create table plants (
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
create table units (
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

-- GENERATION
create table generation (
  id uuid default uuid_generate_v4() primary key,
  plant_id uuid references plants(id) on delete cascade,
  date date not null,
  kwh float8 not null default 0,
  peak_kw float8 default 0,
  performance int default 100,
  unique(plant_id, date)
);

-- ALERTS
create table alerts (
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

-- 4. RLS (Row Level Security) - Simplified for easy demo
alter table profiles enable row level security;
alter table plants enable row level security;
alter table generation enable row level security;

create policy "Public view for demo" on profiles for select using (true);
create policy "Public view for plants" on plants for select using (true);
create policy "Public view for gen" on generation for select using (true);
