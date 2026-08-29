-- M2 Part A: app-only auth/quota/subscription tables.
-- Applied with `supabase db push` or pasted into the dashboard SQL editor.
--
-- Access model: authenticated users may READ their own rows; every write goes
-- through the service role (which bypasses RLS) from /api/app/* handlers.
-- No insert/update/delete policies exist on purpose.

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated
  using ((select auth.uid()) = id);

-- One profile row per auth user, created by the auth server itself so the app
-- never has to race on first login.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that signed up before this migration.
insert into public.profiles (id)
select id from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------- daily_usage
-- date_kst is the calendar day in Asia/Seoul; the server computes it, never
-- the database (the DB clock is UTC and current_date would be wrong for the
-- nine hours after 15:00 UTC).
create table if not exists public.daily_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  date_kst date not null,
  chat_count integer not null default 0 check (chat_count >= 0),
  ad_bonus_count integer not null default 0 check (ad_bonus_count between 0 and 2),
  updated_at timestamptz not null default now(),
  primary key (user_id, date_kst)
);

alter table public.daily_usage enable row level security;

drop policy if exists daily_usage_select_own on public.daily_usage;
create policy daily_usage_select_own on public.daily_usage
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- ----------------------------------------------------------- subscriptions
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users (id) on delete cascade,
  rc_app_user_id text not null,
  entitlement text,                 -- 'premium' while active, null once expired
  expires_at timestamptz,           -- null = no known expiry
  updated_at timestamptz not null default now()
);

alter table public.subscriptions enable row level security;

drop policy if exists subscriptions_select_own on public.subscriptions;
create policy subscriptions_select_own on public.subscriptions
  for select to authenticated
  using ((select auth.uid()) = user_id);

-- ------------------------------------------------------ atomic increments
-- The only write path for daily_usage. Each is a single upsert statement, so
-- two concurrent requests cannot lose an increment. Service role only.

create or replace function public.app_increment_chat(p_user_id uuid, p_date_kst date)
returns table (chat_count integer, ad_bonus_count integer)
language sql
security definer
set search_path = ''
as $$
  insert into public.daily_usage (user_id, date_kst, chat_count)
  values (p_user_id, p_date_kst, 1)
  on conflict (user_id, date_kst) do update
    set chat_count = public.daily_usage.chat_count + 1,
        updated_at = now()
  returning public.daily_usage.chat_count, public.daily_usage.ad_bonus_count;
$$;

-- Returns zero rows when today's two bonuses are already used.
create or replace function public.app_add_ad_bonus(p_user_id uuid, p_date_kst date)
returns table (chat_count integer, ad_bonus_count integer)
language sql
security definer
set search_path = ''
as $$
  insert into public.daily_usage (user_id, date_kst, ad_bonus_count)
  values (p_user_id, p_date_kst, 1)
  on conflict (user_id, date_kst) do update
    set ad_bonus_count = public.daily_usage.ad_bonus_count + 1,
        updated_at = now()
    where public.daily_usage.ad_bonus_count < 2
  returning public.daily_usage.chat_count, public.daily_usage.ad_bonus_count;
$$;

revoke execute on function public.app_increment_chat(uuid, date) from public, anon, authenticated;
revoke execute on function public.app_add_ad_bonus(uuid, date) from public, anon, authenticated;
grant execute on function public.app_increment_chat(uuid, date) to service_role;
grant execute on function public.app_add_ad_bonus(uuid, date) to service_role;
