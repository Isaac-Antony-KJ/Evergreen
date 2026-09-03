-- Evergreen — bill calendar schema
-- Run this once in the Supabase SQL editor (or via `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- calendars
--
-- Evergreen's MVP has no login. Instead each calendar carries two unguessable
-- tokens:
--   secure_token  -> read-only .ics subscription feed (Apple/Google/Outlook)
--   edit_token    -> opens the web app and allows changes
--
-- Anyone holding edit_token can manage the calendar, which is what lets a
-- household share one link and all edit the same bills today. See the
-- "Adding real accounts later" section of README.md for how to evolve this
-- into a calendars.owner_id + calendar_members(calendar_id, user_id, role)
-- pair once Supabase Auth is introduced — that migration is additive and
-- does not require changing this table's shape.
-- ---------------------------------------------------------------------------
create table if not exists calendars (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'My Bills',
  secure_token text not null unique,
  edit_token text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists bills (
  id uuid primary key default gen_random_uuid(),
  calendar_id uuid not null references calendars(id) on delete cascade,
  name text not null,
  day_of_month int not null check (day_of_month between 1 and 31),
  reminder_time time,
  reminder_offset_days int check (reminder_offset_days >= 0),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bills_calendar_id_idx on bills (calendar_id);
create index if not exists calendars_secure_token_idx on calendars (secure_token);
create index if not exists calendars_edit_token_idx on calendars (edit_token);

-- keep updated_at current on every row change
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists calendars_set_updated_at on calendars;
create trigger calendars_set_updated_at
  before update on calendars
  for each row execute function set_updated_at();

drop trigger if exists bills_set_updated_at on bills;
create trigger bills_set_updated_at
  before update on bills
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Both tables have RLS turned on and deliberately carry NO policies for the
-- anon/authenticated/publishable roles. With RLS enabled and zero policies,
-- Postgres denies every row to those roles by default — so even if the
-- publishable key ever ended up in client code, direct table access would
-- still be refused.
--
-- Every read and write in this app goes through server-side code (Server
-- Components, Server Actions, the /calendar/[token] route) using the Supabase
-- secret key, which carries BYPASSRLS and skips these policies entirely.
-- Authorization instead happens in that server code, by looking a row up via
-- its secure_token/edit_token — a row is only ever returned to someone who
-- already holds the matching token. This is "RLS + a trusted server", not
-- "RLS relied on alone": the database refuses direct access outright, and
-- the application layer is the only thing allowed to open the gate.
-- ---------------------------------------------------------------------------
alter table calendars enable row level security;
alter table bills enable row level security;
