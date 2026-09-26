# 90-Day Cut Tracker v3

Mobile-first PWA for the 90-day fat-loss program.

## What changed in v3

- Liquid-glass-inspired mobile redesign based on the visual architecture documented by `sdegenaar/liquid_glass_widgets`.
- Food logging by time of day with food + quantity dropdowns.
- Calories, protein, carbohydrates and fat calculate automatically from logged foods.
- Palaya soru, rice, dosa, chapati, eggs, chicken, fish, dal, sambar, vegetables, curd, fruit, whey and planned small treats are included.
- One daily milk tea is enforced in the logger.
- Restaurant/cheat meal is a rolling 7-day entitlement. A second selection within 7 program days is disabled.
- Any workout template can be loaded on any day, or individual exercises can be added from the preloaded exercise library.
- Exercises can be ticked individually.
- Compact 8-item daily checklist.
- Quick +250 ml / +500 ml water logging.
- Optional water notifications from 11 AM to 11 PM (default every 2 hours).
- Existing local profiles use the same localStorage keys and are migrated automatically.

## Important note about Liquid Glass Widgets

`liquid_glass_widgets` is a Flutter package. This project is a dependency-free HTML/CSS/JavaScript PWA hosted directly by GitHub Pages, so the Flutter package cannot be installed into this codebase without converting the entire app to Flutter and adding a Flutter build pipeline. This version applies the package's documented design rules to the web UI: glass is concentrated in navigation and controls, while content surfaces stay readable and performant.

## Water notification limitation

The PWA can request Android/Chrome notification permission and issue scheduled water reminders while the installed web app is running or retained by Android. Web PWAs cannot guarantee exact local notification alarms after Android fully terminates the app. Guaranteed closed-app reminders would require a native Android build or a push-notification backend.

## Update an existing GitHub Pages repository from Android

Repository: `nova8111/90-day-cut-tracker`

1. Download and extract the v3 ZIP on Android.
2. Open Chrome and visit:
   `https://github.com/nova8111/90-day-cut-tracker/upload/main`
3. Tap **choose your files**.
4. Select the files from the extracted folder. You can upload all project files, or only these changed files:
   - `app.js`
   - `styles.css`
   - `index.html`
   - `sw.js`
   - `manifest.webmanifest`
   - `README.md`
5. GitHub will show them as changed files because files with the same names already exist.
6. In **Commit changes**, use a message such as:
   `Redesign tracker and add meal workout reminders`
7. Choose **Commit directly to the main branch**.
8. Tap **Commit changes**.
9. GitHub Pages will rebuild automatically because Pages is already configured from `main` / root.
10. Open `https://nova8111.github.io/90-day-cut-tracker/` in Chrome after deployment.
11. Refresh the page and fully close/reopen the installed PWA once so the v3 service worker cache replaces the old version.

## Storage

Data is still stored locally in the browser/PWA. Use **Backup** regularly. Clearing site/app storage can erase local data.
