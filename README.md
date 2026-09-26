# 90-Day Cut Tracker (Android PWA)

A dependency-free, mobile-first Progressive Web App built around the 90-day fat-loss and muscle-retention program.

## Android features

- Installable from Chrome as a home-screen app.
- Standalone full-screen app display after installation.
- Offline app-shell caching after the first successful online load.
- Android-friendly 192 px / 512 px / maskable icons.
- Local profile login with a 4–8 digit PIN.
- Daily data retained in browser/app `localStorage`.
- JSON export/import backup.
- 90-day calendar, workouts, meal rotation, weight trend and adjustment logic.

## Recommended phone-only deployment: GitHub Pages

The project intentionally keeps every deployable file in the **root folder**, so it is easy to upload from an Android phone without Git.

Upload these files to the root of the GitHub repository:

- `index.html`
- `app.js`
- `styles.css`
- `manifest.webmanifest`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `icon-maskable-512.png`
- `README.md`

Then enable GitHub Pages from the `main` branch / root folder. The resulting HTTPS URL can be opened in Chrome and installed to the Android home screen.

## Local testing (optional)

On a computer:

```bash
cd 90_day_fat_loss_tracker
python -m http.server 8080
```

Then open `http://localhost:8080`.

The install prompt normally requires HTTPS (or localhost), so use the deployed GitHub Pages URL for normal Android installation.

## Important storage note

The built-in login is **local only**. It is useful for separating profiles on the same device/browser, but it is not a true cloud account system. Clearing app/site storage or uninstalling without a backup can erase local data. Use **Backup** regularly.

## Upgrade to real email login + cloud sync

A practical next step is Supabase because it can provide authentication and Postgres storage. The current app can keep localStorage as an offline cache while syncing daily logs to Supabase.

Suggested schema:

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  start_date date not null,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table daily_logs (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  program_day int not null check (program_day between 1 and 90),
  log_date date not null,
  session text,
  weight numeric,
  waist numeric,
  calories int,
  protein int,
  water numeric,
  steps int,
  checks jsonb not null default '{}'::jsonb,
  notes text,
  closed boolean not null default false,
  updated_at timestamptz not null default now(),
  unique(user_id, program_day)
);

alter table profiles enable row level security;
alter table daily_logs enable row level security;

create policy "profiles own row" on profiles
for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "daily logs own rows" on daily_logs
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

## Health/safety note

This tracker implements the agreed plan but is not medical monitoring. A 91 kg endpoint is a stretch target rather than a mandatory 90-day deadline. The adjustment logic is intentionally conservative: it does not respond to 5–7 day water-weight stalls, protects protein, and avoids crash-diet reductions.
