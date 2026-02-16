# DumbLifts — Project Brief

## What is this?
DumbLifts is a Progressive Web App (PWA) workout tracker for a dumbbell-based 5×5 strength program. It's inspired by StrongLifts 5×5 but adapted for fixed dumbbells at a YMCA gym. Live at https://dumblifts.com.

## Tech Stack
- Single-page app: HTML/CSS/JS all in `index.html` (~2250 lines)
- PWA: `manifest.json` + `sw.js` for offline/installable support
- Data persistence: localStorage (key: `dumblifts`) + optional Firebase/Firestore cloud sync
- Auth: Firebase Authentication (Google sign-in)
- Hosting: Netlify (auto-deploys from GitHub on push to master)
- Domain: dumblifts.com (registered on Porkbun, DNS pointed to Netlify)
- No build step — just static files

## Color Scheme (LOCKED — do not change)
- **Black:** #000000 / #070707 (background)
- **Orange:** #F17300 (primary brand color, completed sets, buttons, logo)
- **Steel blue-gray:** #7A8B8B (secondary — nav, labels, weight displays, accents)
- **Gold:** #C8A84E (exercise group: legs)
- **Text:** #e8e0d0 (body text)
- **Text dim:** #9a9488 (muted/secondary text)
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

Exercises have a `group` field (push/pull/legs) used for color-coding in the UI (orange/steel/gold).

## App Features
- Tap sets (S1-S5) to mark complete — turns orange when done
- Per-set rep tracking: tap a completed set to cycle through 5→4→3→2→1→0→5
- +/- buttons adjust weight in 5 lb increments
- "Complete Workout" button only enables when all 15 sets are done (sticky at bottom)
- Alternates A/B automatically after completing a workout
- Undo last workout (30-second toast after completion)
- Rest timer (90s/120s/180s) with visual countdown bar
- Personal record (PR) detection with toast + badge in history
- Google sign-in with Firestore cloud sync (debounced 300ms)
- Import/export data (JSON backup + CSV export)
- Workout history (last 100 sessions, grouped by month)
- Stats: total workouts, current week, A/B counts, current weights
- Program editor: add/remove/reorder workouts and exercises
- Info tab: collapsible reference cards for schedule, progression, rest, warmup, exercise tips, deload
- Welcome overlay for first-time users
- Reset all data button (with confirmation)
- Toast notifications
- Full offline support via service worker

## Coding Conventions
- All app code lives in `index.html` — CSS in `<style>`, JS in `<script>`
- Use `escapeHtml()` for any user-facing dynamic strings rendered via `innerHTML`
- CSS variables defined in `:root` for colors (e.g., `var(--orange)`, `var(--steel)`)
- State stored in global `state` object, persisted via `saveState()` → localStorage + Firestore
- Exercise data defined in `EXERCISE_LIBRARY` array, workouts built via `buildWorkouts()`
- Rendering functions: `renderWorkout()`, `renderHistory()`, `renderStats()`, `renderProgram()`

## Deployment
Any push to master auto-deploys to Netlify → dumblifts.com.
When updating, bump `CACHE_NAME` in `sw.js` (currently `dumblifts-v26`) so the service worker refreshes.

## File Structure
```
dumblifts/
├── index.html            ← The entire app (~2250 lines)
├── manifest.json         ← PWA manifest
├── sw.js                 ← Service worker (cache-first strategy)
├── CLAUDE.md             ← This file
├── README.md             ← Deploy instructions
├── blog/
│   ├── index.html        ← Blog index page
│   └── *.html            ← SEO blog articles (6 posts)
└── icons/
    ├── icon-192.png      ← App icon
    ├── icon-512.png      ← App icon (large)
    ├── business-card.*   ← Print: business card front (SVG + PNG)
    ├── business-card-back.* ← Print: business card back
    ├── flyer.*           ← Print: portrait flyer (SVG + PNG)
    ├── flyer-landscape.* ← Print: landscape flyer
    ├── sticker.*         ← Print: square sticker (3")
    └── sticker-round.*   ← Print: round sticker (3")
```
