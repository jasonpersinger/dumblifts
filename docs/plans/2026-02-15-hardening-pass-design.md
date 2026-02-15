# DUMBLIFTS Hardening Pass — Design

**Date:** 2026-02-15
**Approach:** Surgical fixes in place — no architecture changes, no file splitting

## Context

DUMBLIFTS is a 2048-line single-file PWA at 18 commits. A CodeRabbit review and deep codebase analysis surfaced bugs, security gaps, performance issues, and accessibility problems. This pass fixes all of them with targeted edits.

## Bug Fixes

1. **Fix `showSection()` implicit event** — Add `event` parameter to the function signature and pass it from `onclick` handlers in the nav bar.
2. **Bound history array at 100 entries** — Trim oldest entries in `completeWorkout()` after pushing new entry. Covers ~8 months of 3x/week use.
3. **Toast queue fix** — Clear any existing toast timeout before showing a new one to prevent overlap and premature dismissal.
4. **`restoreDefault` warning** — Update confirm dialog to mention that current working weights will also be reset to defaults.

## Security Fixes

1. **Escape HTML in auth bar** — Create `escapeHtml()` helper. Use it on `displayName` and `email` before innerHTML insertion in `renderAuthBar()`.
2. **Validate import data types** — After checking key existence, verify `history` is an array, `weights` is an object, `totalWorkouts` is a number. Reject malformed data with toast.
3. **Add `localStorage` try/catch** — Wrap `saveState()` localStorage call in try/catch so Safari private browsing or full storage doesn't silently break the save flow.
4. **Firestore rules reminder** — Add a code comment near Firebase config noting that security depends on Firestore rules being correctly configured (managed outside this repo).

## Performance

1. **Async Firebase SDK** — Add `defer` to all three Firebase `<script>` tags. Wrap `auth.onAuthStateChanged` call so it executes after Firebase scripts have loaded. Core localStorage-based functionality works immediately.
2. **Async Google Fonts** — Switch font `<link>` to non-render-blocking pattern using `media="print" onload="this.media='all'"` with a `<noscript>` fallback.
3. **Rename `--gold` CSS variable to `--steel`** — The variable holds `#7A8B8B` (steel blue-gray), not gold. Rename all references throughout the CSS.

## Accessibility

1. **Remove `user-scalable=no`** from viewport meta tag to allow pinch-to-zoom.
2. **Add ARIA labels to set buttons** — Contextual labels like "Set 1 of Goblet Squat, tap to mark complete".
3. **Add ARIA labels to weight buttons** — Labels like "Decrease Goblet Squat weight" and "Increase Goblet Squat weight".
4. **Add `aria-live="polite"` to toast element** — Screen readers announce toast messages.
5. **Add visible focus indicators** — `:focus-visible` outline style for all interactive elements.

## Files Modified

- `index.html` — All changes
- `sw.js` — Bump CACHE_NAME to v18

## Out of Scope

- innerHTML-to-DOM refactor (too large, not user-visible)
- File splitting / modularization
- New features
- Firestore rules audit (managed in Firebase console, not this repo)
