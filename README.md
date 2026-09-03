# Evergreen

A calm, mobile-first bill calendar. Add your recurring bills once, subscribe
to one link in Apple Calendar, Google Calendar, or Outlook, and the calendar
stays current on its own from then on. The website is the source of truth —
calendar apps only ever read the feed.

## Stack

- Next.js 16 (App Router, Server Actions, Route Handlers)
- TypeScript, React 19
- Tailwind CSS v4 (CSS-first theme, no `tailwind.config.js`)
- Supabase (Postgres + Row Level Security) — database only, no Supabase Auth
- A hand-rolled RFC 5545 `.ics` generator (no calendar library dependency)

## How access works (read this before you dig further)

Evergreen's MVP has **no login**. Each calendar carries two long random
tokens instead:

- **`secure_token`** → the read-only `/calendar/[token].ics` feed that
  Apple/Google/Outlook subscribe to.
- **`edit_token`** → opens `/manage/[editToken]`, the dashboard where bills
  are added, edited, and toggled.

Anyone with the edit link can manage the calendar — that's intentional and
is what lets a household share one link and all edit the same bills today.
Treat both links like passwords: don't post them publicly, and bookmark the
edit link, since there's no "forgot my link" recovery in this MVP (see
**Adding real accounts later** below for the natural next step).

Both tables have Row Level Security **enabled with no policies**, which
makes Postgres deny every row to the public/anon roles by default. Every
read and write in this app runs server-side (Server Components, Server
Actions, the `.ics` route) using Supabase's **secret key**, which bypasses
RLS on purpose. Authorization happens in that server code by looking a row
up via its token — a calendar or bill is only ever returned to someone who
already holds the matching token, and every bill mutation double-checks the
bill actually belongs to that calendar before touching it. See the comments
in `supabase/schema.sql` for the full reasoning.

Because of this, the app **never queries Supabase from the browser** —
there's no publishable/anon key anywhere in this codebase, and
`src/lib/supabase.ts` is guarded with the `server-only` package so importing
it from a Client Component fails the build rather than shipping the secret
key to a browser.

## Setup

**Prerequisites:** Node.js 22 or later (Node 20 has reached end-of-life and
current Supabase client libraries no longer support it).

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create a Supabase project** at [supabase.com](https://supabase.com) if
   you don't have one.

3. **Run the schema.** Open the SQL editor in your Supabase project and run
   the contents of `supabase/schema.sql`. This creates the `calendars` and
   `bills` tables, their indexes and `updated_at` triggers, and turns on RLS.

4. **Copy your environment variables.** Duplicate `.env.local.example` as
   `.env.local` and fill in:

   - `SUPABASE_URL` — your project URL, from **Project Settings → API Keys**.
   - `SUPABASE_SECRET_KEY` — from the same page, under **Secret keys**
     (starts with `sb_secret_...`). If your project still only shows the
     older `anon` / `service_role` keys, use the `service_role` key here —
     it plays the same role, just under the previous naming.

   Neither variable needs a `NEXT_PUBLIC_` prefix — see above for why.

5. **Run it**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`, create a calendar, add a bill, and open
   `/manage/<your-edit-token>/share` to see the generated `.ics` URL. You can
   fetch that URL directly in a browser to see the raw feed.

## Deploying

This app deploys to Vercel with no special configuration:

1. Push the project to a Git repository and import it in Vercel.
2. Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` as environment variables in
   the Vercel project settings (same values as `.env.local`).
3. Deploy. Subscription links are built from the incoming request's host
   header, so they're correct automatically on your production domain and
   on every preview deployment — no `NEXT_PUBLIC_APP_URL` to keep in sync.

## Project structure

```
src/
  app/
    page.tsx                          Landing page
    actions.ts                        createCalendar()
    calendar/[token]/route.ts         The .ics feed (public, token-gated)
    manage/[editToken]/
      layout.tsx                      Validates the edit token, shared nav
      page.tsx                        Dashboard (bill list)
      actions.ts                      Bill CRUD + regenerate-token actions
      share/page.tsx                  Subscription URL + app instructions
      bills/new/page.tsx              Add-bill form
      bills/[billId]/edit/page.tsx    Edit-bill form + delete
  components/                         UI building blocks (ui/ = primitives)
  lib/
    ics.ts                            RFC 5545 .ics generator
    supabase.ts                       Server-only Supabase client (secret key)
    queries.ts                        Cached, server-only data access
    validation.ts                     Zod schema for bill input
    tokens.ts                         Secure random token generator
supabase/schema.sql                   Full DB schema, RLS, triggers
```

## About the `.ics` feed

- One `VEVENT` per bill with `RRULE:FREQ=MONTHLY;BYMONTHDAY=<day>` — never
  one event per future occurrence.
- Each event's `UID` is derived from the bill's database id, so it stays
  stable across regenerations and edits don't create duplicate events in
  subscribed calendars.
- A day that doesn't exist in a given month (the 31st in April, for
  instance) is simply skipped that month — this is standard `RRULE`
  behavior, not a bug, and the bill form has a note about it.
- Reminders are encoded as a `VALARM` with a `TRIGGER` duration computed
  from the reminder offset and time of day, so "1 day before at 9am" is
  exact rather than approximate.
- Disabled bills are left out of the feed entirely rather than included and
  hidden.

## Adding real accounts later

The dual-token model above is deliberately the simplest thing that could
satisfy "subscribe link" + "edit link" + "a household can share one edit
link." When you're ready for real accounts (password reset, knowing *which*
person changed a bill, per-person revocation), the migration is additive:

1. Add Supabase Auth and a `calendars.owner_id uuid references auth.users`.
2. Add a `calendar_members (calendar_id, user_id, role)` join table —
   `role` of `'owner' | 'editor'` is enough to start.
3. Replace the `edit_token` lookup in `getCalendarByEditToken` with a
   session-based lookup against `calendar_members`, and turn the "share"
   page's regenerate action into a real invite flow.
4. `secure_token` and the `.ics` route don't need to change at all — the
   subscription link stays a public, unguessable URL either way.

Nothing about today's schema or route structure has to be torn out to get
there.

## Known limitations (by design, for an MVP)

- No password/email recovery for a lost edit link — bookmark it.
- Reminder alarms are computed as a duration from midnight of the due date,
  which calendar apps generally interpret in the *viewing* calendar's local
  time zone. This matches how every all-day recurring event with an alarm
  behaves across Apple/Google/Outlook — it isn't specific to Evergreen.
- Calendar apps poll subscribed URLs on their own schedule (often hours
  apart, and not configurable by the feed itself), so a bill you just added
  may take a while to appear in a calendar app that's already subscribed.
