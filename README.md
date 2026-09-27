# 90-Day Cut Tracker v4

Mobile-first PWA for the 90-day fat-loss program.

## What changed in v4

- New black + red Liquid-Glass-inspired visual theme.
- New black/red app icon plus an Android notification badge.
- One original motivational mindset line for every program day from Day 1 through Day 90.
- Persistent custom-food library:
  - Add your own food name.
  - Add a serving description.
  - Calories are required.
  - Protein, carbohydrate and fat are optional.
  - Each saved food becomes available in every meal dropdown across all 90 days.
  - Existing meals stay unchanged even if a saved food is later removed from the library.
  - Custom foods are included in JSON backups.
- Water notification improvements:
  - Fixes the old 2-minute notification window.
  - Checks the latest due reminder whenever the PWA is active, wakes or regains focus.
  - Uses persistent service-worker notifications on Android.
  - Includes **Send test notification** and notification diagnostics in Settings.
  - Notification taps focus/reopen the tracker.
- Existing v3 profiles and day logs migrate automatically.

## Why exact closed-app water alarms are still limited

This remains a static GitHub Pages PWA. Android can suspend a web app and there is no production-standard browser API that guarantees exact local scheduled alarms after the PWA has been fully stopped. v4 makes reminders much more reliable while the PWA is alive or wakes, and it gives you a test button so you can verify Android permission and delivery. Guaranteed exact alarms would require either:

1. a native Android build, or
2. a server/push-notification backend.

If **Send test notification** does not appear even when the app reports permission as `granted`, long-press the Cut Tracker icon → **App info** → **Notifications** and allow notifications.

## Important note about Liquid Glass Widgets

`sdegenaar/liquid_glass_widgets` is a Flutter package. This project is a dependency-free HTML/CSS/JavaScript PWA hosted directly by GitHub Pages, so the Flutter package cannot be installed directly without converting the whole project to Flutter. The web version follows the same design principle: glass is concentrated on navigation and controls, while primary content remains readable and fast.

## Update the existing GitHub Pages repository from Android

Repository: `nova8111/90-day-cut-tracker`

1. Download and extract the **v4 update-only ZIP** on Android.
2. Open Chrome and visit:
   `https://github.com/nova8111/90-day-cut-tracker/upload/main`
3. Tap **choose your files**.
4. Select all files from the update folder:
   - `app.js`
   - `styles.css`
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `README.md`
   - `icon-192.png`
   - `icon-512.png`
   - `icon-maskable-512.png`
   - `notification-badge-96.png`
5. GitHub will recognize existing filenames as replacements and the badge as a new file.
6. Use commit message:
   `Add custom foods, notifications, quotes and red theme`
7. Choose **Commit directly to the main branch**.
8. Tap **Commit changes**.
9. GitHub Pages redeploys automatically from `main` / root.
10. Open `https://nova8111.github.io/90-day-cut-tracker/` in Chrome after deployment.
11. Refresh once, then fully close and reopen the installed PWA so the `cut-tracker-v4` service worker replaces the old cache.
12. If Android still shows the old home-screen icon after the new site is live, remove the installed PWA from the home screen/app list and install it again. Your profile normally stays in site storage, but export a backup first before reinstalling if you want to be extra safe.

## Storage

Data is stored locally in the browser/PWA. Use **Backup** regularly. Clearing site/app storage can erase local data. Custom foods are stored inside the same profile and therefore are included in exported JSON backups.
