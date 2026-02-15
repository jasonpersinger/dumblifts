# DumbLifts — Project Brief

## What is this?
DumbLifts is a Progressive Web App (PWA) workout tracker for a dumbbell-based 5×5 strength program. It's inspired by StrongLifts 5×5 but adapted for fixed dumbbells at a YMCA gym. Live at https://dumblifts.com.

## Tech Stack
- Single-page app: HTML/CSS/JS all in `index.html`
- PWA: `manifest.json` + `sw.js` for offline/installable support
- Data persistence: localStorage (key: `dumblifts`)
- Hosting: Netlify (auto-deploys from GitHub on push to main)
- Domain: dumblifts.com (registered on Porkbun, DNS pointed to Netlify)
- No build step — just static files

## Color Scheme (LOCKED — do not change)
- **Black:** #000000 / #070707 (background)
- **Orange:** #F17300 (primary brand color, completed sets, buttons, logo)
- **Steel blue-gray:** #7A8B8B (secondary — nav, labels, weight displays, accents)
- **Text:** #e8e0d0 (body text)
- **Text dim:** #8a8478 (muted/secondary text)
- **Card bg:** #0d0d0d
- **Card border:** #1a1a1a

## Branding
- Always "DUMBLIFTS" — all caps, Oswald bold, #F17300
- Logo: inline SVG in header — compact dumbbell icon + divider + DUMBLIFTS wordmark
- App icons: orange dumbbell on black (in /icons/)
- Subtitle: "Dumbbell 5×5 Program" in steel blue-gray

## Typography
- Headings/UI: Oswald (700 weight, uppercase, letter-spacing)
- Body: Source Sans 3

## The Program
Two alternating workouts, 3 days per week (A/B/A, then B/A/B):

**Workout A:**
- Goblet Squat 5×5 (single DB, default 30 lb)
- DB Bench Press 5×5 (default 20 lb ea.)
- DB Row 5×5 (default 20 lb ea.)

**Workout B:**
- DB Romanian Deadlift 5×5 (default 30 lb ea.)
- DB Overhead Press 5×5 (default 15 lb ea.)
- DB Floor Press 5×5 (default 20 lb ea.)

**Progression:** Fixed dumbbells go up in 5 lb jumps. Stay at weight until 5×5 is solid, then jump. Deload 10% after 3 consecutive failures.

## App Features
- Tap sets (S1-S5) to mark complete — turns orange when done
- +/- buttons adjust weight in 5 lb increments
- "Complete Workout" button only enables when all 15 sets are done
- Alternates A/B automatically after completing a workout
- Workout history (last 20 sessions)
- Stats: total workouts, current week, A/B counts, current weights
- Info tab: schedule, progression, rest, warmup, exercise tips, deload protocol
- Reset all data button (with confirmation)
- Toast notifications
- Full offline support via service worker

## Deployment
Any push to main auto-deploys to Netlify → dumblifts.com.
When updating, bump CACHE_NAME in sw.js (e.g., v2 → v3) so the service worker refreshes.

## File Structure
```
dumblifts/
├── index.html       ← The entire app
├── manifest.json    ← PWA manifest
├── sw.js            ← Service worker
├── README.md        ← Deploy instructions
└── icons/
    ├── icon-192.png
    └── icon-512.png
```
