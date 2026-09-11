-- Profiles table linked to auth.users
-- Contact form submissions used by the public forms and admin panel.
create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  type text,
  phone text,
  company text,
  event_type text,
  event_date text,
  guests integer,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions add column if not exists type text;
alter table public.contact_submissions add column if not exists phone text;
alter table public.contact_submissions add column if not exists company text;
alter table public.contact_submissions add column if not exists event_type text;
alter table public.contact_submissions add column if not exists event_date text;
alter table public.contact_submissions add column if not exists guests integer;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions(created_at desc);

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

-- Ensure index on role
create index if not exists profiles_role_idx on public.profiles(role);

-- Stores the single administrator email used by the first-admin signup lock.
create table if not exists public.app_settings (
  id integer primary key check (id = 1),
  admin_email text,
  created_at timestamptz not null default now()
);

insert into public.app_settings (id)
values (1)
on conflict (id) do nothing;

alter table public.app_settings enable row level security;

-- The signup page must be able to check whether the first admin exists.
drop policy if exists "app_settings_read_public" on public.app_settings;
create policy "app_settings_read_public" on public.app_settings
  for select using (true);

-- Only an authenticated user can claim the empty admin slot.
drop policy if exists "app_settings_claim_admin" on public.app_settings;
create policy "app_settings_claim_admin" on public.app_settings
  for update using (admin_email is null and auth.role() = 'authenticated')
  with check (admin_email is not null and auth.role() = 'authenticated');

-- Enable Row Level Security on profiles
alter table public.profiles enable row level security;

-- Policy: allow users to insert their own profile (when signing up)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.role() = 'authenticated' and auth.uid() = id);

-- Policy: allow users to select/update their own profile
drop policy if exists "profiles_manage_own" on public.profiles;
create policy "profiles_manage_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Allow admins (role = 'admin' in profiles) to select all profiles
drop policy if exists "profiles_select_admins" on public.profiles;
create policy "profiles_select_admins" on public.profiles
  for select using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- CONTACT SUBMISSIONS table policies
alter table public.contact_submissions enable row level security;

-- Allow anyone (anon) to insert contact submissions
drop policy if exists "contact_insert_public" on public.contact_submissions;
create policy "contact_insert_public" on public.contact_submissions
  for insert with check (true);

-- Allow admins to select and delete submissions
drop policy if exists "contact_manage_admins" on public.contact_submissions;
create policy "contact_manage_admins" on public.contact_submissions
  for select using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

drop policy if exists "contact_delete_admins" on public.contact_submissions;
create policy "contact_delete_admins" on public.contact_submissions
  for delete using (exists (
    select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
  ));

-- Prevent non-admins from selecting/deleting

-- Refresh PostgREST after creating or changing the tables.
notify pgrst, 'reload schema';
