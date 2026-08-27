-- ══════════════════════════════════════════════════════════════
-- Vertex 7 — Supabase Database Setup
-- ══════════════════════════════════════════════════════════════
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- This creates all tables, RLS policies, and storage buckets.
-- ══════════════════════════════════════════════════════════════

-- ── Projects Table ──────────────────────────────────────────
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  location text default '',
  category text default '',
  description text default '',
  scope text[] default '{}',
  equipment text[] default '{}',
  cover_image text default '',
  gallery text[] default '{}',
  published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Machines Table ──────────────────────────────────────────
create table if not exists machines (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  brand text default '',
  model text default '',
  type text default '',
  category text default '',
  image text default '',
  description text default '',
  specs jsonb default '{}',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Services Table ──────────────────────────────────────────
create table if not exists services (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  number text default '01',
  short_description text default '',
  description text default '',
  image text default '',
  benefits text[] default '{}',
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────

-- Projects
alter table projects enable row level security;

create policy "Public read published projects"
  on projects for select
  using (published = true);

create policy "Auth full access projects"
  on projects for all
  using (auth.role() = 'authenticated');

-- Machines
alter table machines enable row level security;

create policy "Public read published machines"
  on machines for select
  using (published = true);

create policy "Auth full access machines"
  on machines for all
  using (auth.role() = 'authenticated');

-- Services
alter table services enable row level security;

create policy "Public read published services"
  on services for select
  using (published = true);

create policy "Auth full access services"
  on services for all
  using (auth.role() = 'authenticated');

-- ── Auto-update updated_at ─────────────────────────────────
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at
  before update on projects
  for each row execute function update_updated_at();

create trigger machines_updated_at
  before update on machines
  for each row execute function update_updated_at();

create trigger services_updated_at
  before update on services
  for each row execute function update_updated_at();

-- ── Storage ─────────────────────────────────────────────────
-- NOTE: Create the storage bucket manually in the Supabase Dashboard:
--   Storage → New Bucket → Name: "images" → Public bucket: ON
--
-- Then add these storage policies via SQL:

-- Allow public read
create policy "Public read images"
  on storage.objects for select
  using (bucket_id = 'images');

-- Allow authenticated users to upload
create policy "Auth upload images"
  on storage.objects for insert
  with check (bucket_id = 'images' and auth.role() = 'authenticated');

-- Allow authenticated users to update
create policy "Auth update images"
  on storage.objects for update
  using (bucket_id = 'images' and auth.role() = 'authenticated');

-- Allow authenticated users to delete
create policy "Auth delete images"
  on storage.objects for delete
  using (bucket_id = 'images' and auth.role() = 'authenticated');
