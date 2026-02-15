# DUMBLIFTS Hardening Pass — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all bugs, security issues, performance problems, and accessibility gaps in the DUMBLIFTS PWA with surgical, in-place edits.

**Architecture:** Single-file PWA (index.html + sw.js). All changes are direct edits — no new files, no architecture changes.

**Tech Stack:** Vanilla HTML/CSS/JS, Firebase compat SDK, service worker

---

## Task 1: Bug Fixes

**Files:**
- Modify: `index.html:1005-1008` (nav onclick handlers)
- Modify: `index.html:1886-1896` (showSection function)
- Modify: `index.html:1642` (history.push in completeWorkout)
- Modify: `index.html:1898-1903` (showToast)
- Modify: `index.html:1773-1774` (restoreDefault confirm)

**Step 1: Fix `showSection()` implicit event**

In the nav bar (line 1005-1008), pass `event` explicitly:

```html
<button class="active" onclick="showSection('workout', event)">Workout</button>
<button onclick="showSection('history', event)">History</button>
<button onclick="showSection('stats', event)">Stats</button>
<button onclick="showSection('program', event)">Program</button>
```

In the function (line 1886), accept the parameter:

```javascript
function showSection(name, e) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.getElementById(`sec-${name}`).classList.add('active');
  document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
  e.currentTarget.classList.add('active');
```

**Step 2: Bound history at 100 entries**

After line 1642 (`state.history.push(entry)`), add:

```javascript
  // Keep history bounded to 100 entries
  if (state.history.length > 100) {
    state.history = state.history.slice(-100);
  }
```

**Step 3: Fix toast overlap**

Add a global timer variable near the rest timer state (line 1172):

```javascript
let toastTimer = null;
```

Replace `showToast` (lines 1898-1903):

```javascript
function showToast(msg) {
  const t = document.getElementById('toast');
  if (toastTimer) clearTimeout(toastTimer);
  t.textContent = msg;
  t.classList.add('show');
  toastTimer = setTimeout(() => { t.classList.remove('show'); toastTimer = null; }, 2200);
}
```

**Step 4: Fix restoreDefault confirm message**

Change line 1774 from:
```javascript
if (!confirm('Restore default A/B program? This resets your workout configuration but keeps your history.')) return;
```
To:
```javascript
if (!confirm('Restore default A/B program? This resets your workout configuration and weights but keeps your history.')) return;
```

**Step 5: Verify**

Open the app in browser. Test:
- Click between nav tabs — should work, no console errors
- Complete a workout — toast should show, no overlap on rapid actions
- Check console for `event` reference errors — should be none

**Step 6: Commit**

```bash
git add index.html
git commit -m "fix: showSection implicit event, bound history, toast overlap, restoreDefault warning"
```

---

## Task 2: Security Fixes

**Files:**
- Modify: `index.html:1054` (add escapeHtml helper after Firebase init)
- Modify: `index.html:1167-1170` (saveState try/catch)
- Modify: `index.html:1820-1828` (import validation)
- Modify: `index.html:1983-1997` (renderAuthBar escaping)
- Modify: `index.html:1056` (add Firestore rules comment)

**Step 1: Add `escapeHtml` helper**

After the Firebase init block (after line 1069), add:

```javascript
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

**Step 2: Escape auth bar HTML**

In `renderAuthBar` (line 1989), change:
```javascript
const name = user.displayName || user.email || '';
```
To:
```javascript
const name = escapeHtml(user.displayName || user.email || '');
```

**Step 3: Add localStorage try/catch to saveState**

Change `saveState` (lines 1167-1170) to:
```javascript
function saveState() {
  try {
    localStorage.setItem('dumblifts', JSON.stringify(state));
  } catch (e) {
    console.log('localStorage save failed:', e);
  }
  syncToFirestore();
}
```

**Step 4: Validate import data types**

After the key existence check in `importData` (after line 1827), add type validation:

```javascript
        if (!Array.isArray(data.history) ||
            typeof data.weights !== 'object' || data.weights === null ||
            typeof data.totalWorkouts !== 'number' ||
            typeof data.nextWorkout !== 'string' ||
            !Array.isArray(data.program)) {
          showToast('Invalid backup file');
          return;
        }
```

**Step 5: Add Firestore rules comment**

Before the Firebase config (line 1055), add:

```javascript
// SECURITY NOTE: Firebase API keys are public by design. Access control
// depends on Firestore security rules configured in the Firebase console.
```

**Step 6: Verify**

- App loads normally, sign-in still works
- Export then re-import data — should succeed
- Create a malformed JSON file and try importing — should show "Invalid backup file"

**Step 7: Commit**

```bash
git add index.html
git commit -m "fix: escape auth HTML, validate imports, add localStorage try/catch"
```

---

## Task 3: Performance

**Files:**
- Modify: `index.html:48` (Google Fonts link)
- Modify: `index.html:1050-1052` (Firebase script tags)
- Modify: `index.html:1054-1069` (Firebase init — wrap in load check)
- Modify: `index.html:2025` (auth.onAuthStateChanged)
- Modify: `index.html:50-57` (CSS variable rename --gold to --steel)
- Modify: All `var(--gold` references in CSS and JS (~36 occurrences)

**Step 1: Async Google Fonts**

Change line 48 from:
```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet">
```
To:
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap" rel="stylesheet"></noscript>
```

**Step 2: Defer Firebase SDK**

Change lines 1050-1052 from:
```html
<script src="https://www.gstatic.com/firebasejs/11.3.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.3.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore-compat.js"></script>
```
To:
```html
<script defer src="https://www.gstatic.com/firebasejs/11.3.0/firebase-app-compat.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/11.3.0/firebase-auth-compat.js"></script>
<script defer src="https://www.gstatic.com/firebasejs/11.3.0/firebase-firestore-compat.js"></script>
```

**Important note on defer:** All three Firebase scripts are external with `defer`, so they load in order and execute after HTML parsing but before DOMContentLoaded. The inline `<script>` that follows will also execute after them (since it's after them in the DOM and inline scripts execute in document order). So the Firebase init code inside the inline script should still work — `firebase` will be defined by the time the inline script runs. However, we need to verify this works correctly since `defer` only applies to external scripts with `src`.

Actually, `defer` on external scripts means they execute in order, after parsing. The inline script block comes after them in source order, so it naturally executes after all deferred scripts. This should work without any wrapper.

**Step 3: Rename --gold to --steel**

In the CSS `:root` block (lines 55-57), rename:
```css
    --steel: #7A8B8B;
    --steel-dim: rgba(122, 139, 139, 0.15);
    --steel-mid: rgba(122, 139, 139, 0.35);
```

Then find-and-replace all occurrences throughout the file:
- `var(--gold)` → `var(--steel)` (33 occurrences in CSS + 2 in JS)
- `var(--gold-dim)` → `var(--steel-dim)` (2 occurrences)
- `var(--gold-mid)` → `var(--steel-mid)` (4 occurrences)

**Step 4: Verify**

- App loads — fonts appear without blocking (brief FOUT is expected and acceptable)
- Firebase sign-in still works (scripts loaded in correct order)
- All steel-blue-gray colors render correctly (no missing variable references)
- Check Network tab: Firebase scripts should show as deferred

**Step 5: Commit**

```bash
git add index.html
git commit -m "perf: async fonts, defer Firebase SDK, rename --gold to --steel"
```

---

## Task 4: Accessibility

**Files:**
- Modify: `index.html:5` (viewport meta)
- Modify: `index.html:1048` (toast element — add aria-live)
- Modify: `index.html:1208-1210` (weight button ARIA in renderWorkout)
- Modify: `index.html:1213-1217` (set button ARIA in renderWorkout)
- Add CSS: focus-visible styles (after line 65)

**Step 1: Remove user-scalable=no**

Change line 5 from:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
```
To:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

**Step 2: Add aria-live to toast**

Change line 1048 from:
```html
<div class="toast" id="toast"></div>
```
To:
```html
<div class="toast" id="toast" role="status" aria-live="polite"></div>
```

**Step 3: Add ARIA labels to weight buttons**

In `renderWorkout` (lines 1208-1210), change:
```javascript
          <button class="weight-btn" onclick="changeWeight('${ex.id}', -5)">−</button>
          <div class="weight-display">${state.weights[ex.id]}<span class="weight-unit">${ex.unit}</span></div>
          <button class="weight-btn" onclick="changeWeight('${ex.id}', 5)">+</button>
```
To:
```javascript
          <button class="weight-btn" onclick="changeWeight('${ex.id}', -5)" aria-label="Decrease ${ex.name} weight">−</button>
          <div class="weight-display">${state.weights[ex.id]}<span class="weight-unit">${ex.unit}</span></div>
          <button class="weight-btn" onclick="changeWeight('${ex.id}', 5)" aria-label="Increase ${ex.name} weight">+</button>
```

**Step 4: Add ARIA labels to set buttons**

In `renderWorkout` (lines 1213-1217), change:
```javascript
            <button class="set-btn ${reps > 0 ? (reps === 5 ? 'done' : 'done partial') : ''}" onclick="toggleSet('${ex.id}', ${i})">
              <span class="set-num">S${i+1}</span>
              <span class="set-reps">×${reps > 0 ? reps : 5}</span>
            </button>
```
To:
```javascript
            <button class="set-btn ${reps > 0 ? (reps === 5 ? 'done' : 'done partial') : ''}" onclick="toggleSet('${ex.id}', ${i})" aria-label="Set ${i+1} of ${ex.name}, ${reps > 0 ? reps + ' reps done' : 'not started'}">
              <span class="set-num">S${i+1}</span>
              <span class="set-reps">×${reps > 0 ? reps : 5}</span>
            </button>
```

**Step 5: Add focus-visible styles**

After the `* { margin: 0; ... }` rule (after line 65), add:

```css
  *:focus-visible {
    outline: 2px solid var(--orange);
    outline-offset: 2px;
  }
```

**Step 6: Verify**

- Pinch-to-zoom works on mobile
- Tab through the app — orange focus ring visible on all interactive elements
- Screen reader (or browser accessibility tree) shows meaningful labels for set and weight buttons
- Complete a set — toast should be announced by screen reader

**Step 7: Commit**

```bash
git add index.html
git commit -m "a11y: enable zoom, add ARIA labels, focus indicators, live toast"
```

---

## Task 5: Service Worker Cache Bump

**Files:**
- Modify: `sw.js:1` (CACHE_NAME)

**Step 1: Bump cache version**

Change line 1 of `sw.js` from:
```javascript
const CACHE_NAME = 'dumblifts-v17';
```
To:
```javascript
const CACHE_NAME = 'dumblifts-v18';
```

**Step 2: Commit**

```bash
git add sw.js
git commit -m "chore: bump service worker cache to v18"
```

---

## Summary

| Task | Changes | Risk |
|------|---------|------|
| 1. Bug fixes | 4 targeted fixes | Low — isolated logic changes |
| 2. Security | escapeHtml, import validation, try/catch | Low — additive only |
| 3. Performance | async fonts, defer SDK, CSS rename | Medium — defer timing needs verification |
| 4. Accessibility | viewport, ARIA, focus styles | Low — purely additive |
| 5. Cache bump | Version string | None |

Total: ~15 edit points across 2 files. No new files, no architecture changes.
