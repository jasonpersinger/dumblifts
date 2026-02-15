# SEO & Growth Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make DUMBLIFTS findable by Google and give people a reason to link to it.

**Architecture:** Static files only. New blog posts follow the existing template in `blog/`. robots.txt and sitemap.xml are new root-level files. CSV export is a JS function added to index.html alongside the existing JSON export.

**Tech Stack:** HTML, vanilla JS, static XML/txt files

---

## Task 1: robots.txt + sitemap.xml

**Files:**
- Create: `robots.txt`
- Create: `sitemap.xml`

**Step 1: Create robots.txt**

```
User-agent: *
Allow: /
Sitemap: https://dumblifts.com/sitemap.xml
```

**Step 2: Create sitemap.xml**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://dumblifts.com/</loc><priority>1.0</priority></url>
  <url><loc>https://dumblifts.com/blog/</loc><priority>0.7</priority></url>
  <url><loc>https://dumblifts.com/blog/dumbbell-5x5-program.html</loc><priority>0.8</priority></url>
  <url><loc>https://dumblifts.com/blog/stronglifts-dumbbells.html</loc><priority>0.8</priority></url>
  <url><loc>https://dumblifts.com/blog/free-workout-tracker.html</loc><priority>0.8</priority></url>
  <url><loc>https://dumblifts.com/blog/ymca-dumbbell-workout.html</loc><priority>0.8</priority></url>
  <url><loc>https://dumblifts.com/blog/progressive-overload-dumbbells.html</loc><priority>0.8</priority></url>
  <url><loc>https://dumblifts.com/blog/single-html-file-workout-tracker.html</loc><priority>0.8</priority></url>
</urlset>
```

**Step 3: Commit**

```bash
git add robots.txt sitemap.xml
git commit -m "add robots.txt and sitemap.xml for search engine crawling"
```

---

## Task 2: CSV Export

**Files:**
- Modify: `index.html:1470-1475` (add CSV export button)
- Modify: `index.html:1813` (add exportCSV function after exportData)

**Step 1: Add CSV export button**

In the "Your Data" info-card section (line 1471-1475), add a CSV export button between the existing Export and Import buttons:

```javascript
  html += `<div class="info-card">
    <h3>Your Data</h3>
    <button class="add-workout-btn" onclick="exportData()" style="margin-top:0;">Export Backup</button>
    <button class="add-workout-btn" onclick="exportCSV()">Export CSV</button>
    <button class="add-workout-btn" onclick="importData()">Import Backup</button>
  </div>`;
```

**Step 2: Add exportCSV function**

After the `exportData` function (after its closing brace), add:

```javascript
function exportCSV() {
  if (!state.history.length) {
    showToast('No workout data to export');
    return;
  }
  const rows = ['Date,Workout,Exercise,Weight,Unit,S1,S2,S3,S4,S5'];
  state.history.forEach(h => {
    h.exercises.forEach(ex => {
      const sets = ex.sets ? ex.sets.join(',') : '5,5,5,5,5';
      rows.push(`"${h.date}","${h.type}","${ex.name}",${ex.weight},"${ex.unit}",${sets}`);
    });
  });
  const csv = rows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `dumblifts-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast('CSV exported');
}
```

**Step 3: Verify**

Open app, go to Program tab, scroll to "Your Data" section. CSV button should appear. If history exists, clicking it downloads a .csv file that opens correctly in a spreadsheet.

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add CSV export for workout history"
```

---

## Task 3: Blog Post -- YMCA Dumbbell Workout

**Files:**
- Create: `blog/ymca-dumbbell-workout.html`

Use the exact same HTML template as `blog/dumbbell-5x5-program.html` (same CSS, header, footer structure). Key metadata:

- Title: `Dumbbell Workout at the YMCA: A Simple 5x5 Routine | DUMBLIFTS`
- Description: `A simple dumbbell-only workout routine for the YMCA or any gym with fixed dumbbells. Three exercises, five sets of five, three days a week.`
- Keywords: `YMCA dumbbell workout, gym workout with dumbbells only, fixed dumbbell workout, YMCA gym routine, dumbbell only gym workout`
- Canonical: `https://dumblifts.com/blog/ymca-dumbbell-workout.html`

**Content outline (no em dashes):**

1. **The YMCA Dumbbell Situation** -- Most YMCAs have a solid rack of fixed dumbbells from 5 to 50+ pounds but no squat rack or Olympic barbell. This is actually all you need.
2. **The Routine** -- Workout A and B tables (same as main program). Emphasize these are all doable with the equipment at a typical YMCA.
3. **Why Fixed Dumbbells Work** -- 5-pound jumps are bigger than barbell micro-loading, but that's fine. You build at the weight until it's solid, then jump.
4. **What to Do When the Dumbbells Run Out** -- If you max out the rack, switch to slower tempos, pause reps, or higher volume.
5. **Track It** -- CTA to the app.

Cross-link to: "The Dumbbell 5x5 Program" post and "Progressive Overload With Fixed Dumbbells" post.

**Commit:**

```bash
git add blog/ymca-dumbbell-workout.html
git commit -m "add blog post: YMCA dumbbell workout"
```

---

## Task 4: Blog Post -- Progressive Overload With Fixed Dumbbells

**Files:**
- Create: `blog/progressive-overload-dumbbells.html`

Same template. Key metadata:

- Title: `How to Do Progressive Overload With Fixed Dumbbells | DUMBLIFTS`
- Description: `Fixed dumbbells jump in 5-pound increments. Here is how to handle progressive overload, when to move up, and what to do when you stall.`
- Keywords: `progressive overload dumbbells, fixed dumbbell progression, dumbbell progressive overload, when to increase dumbbell weight, dumbbell deload`
- Canonical: `https://dumblifts.com/blog/progressive-overload-dumbbells.html`

**Content outline:**

1. **The Problem** -- Barbells let you add 2.5 lbs. Dumbbells jump 5 lbs (or 10 lbs total for two-hand exercises). That's a big jump.
2. **The Strategy** -- Stay at a weight until 5x5 is solid. Push for 5x6 or 5x7 before jumping. Accept that you'll drop reps after jumping.
3. **What Stalling Looks Like** -- Three sessions where you can't hit 5x5. This is normal.
4. **The Deload Protocol** -- Drop 10%, build back up. Explain why this works (fatigue management, CNS recovery).
5. **Tracking Matters** -- If you don't write it down, you can't tell if you're progressing. CTA to the app.

Cross-link to: "Dumbbell 5x5 Program" post and "YMCA Dumbbell Workout" post.

**Commit:**

```bash
git add blog/progressive-overload-dumbbells.html
git commit -m "add blog post: progressive overload with fixed dumbbells"
```

---

## Task 5: Blog Post -- Single HTML File Workout Tracker

**Files:**
- Create: `blog/single-html-file-workout-tracker.html`

Same template. Key metadata:

- Title: `I Built a Workout Tracker in a Single HTML File | DUMBLIFTS`
- Description: `A 2000-line PWA workout tracker with no build step, no framework, no dependencies. Just one HTML file, a service worker, and localStorage.`
- Keywords: `single file web app, simple PWA, vanilla JS web app, no framework web app, single HTML file app`
- Canonical: `https://dumblifts.com/blog/single-html-file-workout-tracker.html`

**Content outline (tech audience, casual tone):**

1. **Why One File** -- No build step means zero tooling overhead. Deploy by dragging a folder to Netlify. Edit in any text editor. The entire app is readable in one scroll.
2. **The Stack** -- HTML + inline CSS + inline JS. Google Fonts. Firebase for optional cloud sync. Service worker for offline. That's it.
3. **What It Does** -- Quick feature rundown. Tap sets, track weights, see progress charts, export data. All in ~2000 lines.
4. **The Tradeoffs** -- No component model. Global functions. innerHTML everywhere. At 2000 lines it's fine. At 5000 it wouldn't be.
5. **Would I Do It Again** -- Yes. For a focused tool with a single purpose, a single file is the right call. Not everything needs React.

Cross-link to: "Free Workout Tracker" post. CTA to the app and to the GitHub repo.

**Commit:**

```bash
git add blog/single-html-file-workout-tracker.html
git commit -m "add blog post: single HTML file workout tracker"
```

---

## Task 6: Update Blog Index + Cross-Linking

**Files:**
- Modify: `blog/index.html` (add 3 new post cards)
- Modify: `blog/dumbbell-5x5-program.html` (add cross-links)
- Modify: `blog/stronglifts-dumbbells.html` (add cross-links)
- Modify: `blog/free-workout-tracker.html` (add cross-links)

**Step 1: Add new posts to blog index**

In `blog/index.html`, add three new `<a class="blog-card">` blocks after the existing three, before the closing `</div>` of `.blog-list`:

Card 1:
- href: `/blog/ymca-dumbbell-workout.html`
- h2: `Dumbbell Workout at the YMCA: A Simple 5x5 Routine`
- p: Short description
- Read More span

Card 2:
- href: `/blog/progressive-overload-dumbbells.html`
- h2: `How to Do Progressive Overload With Fixed Dumbbells`
- p: Short description
- Read More span

Card 3:
- href: `/blog/single-html-file-workout-tracker.html`
- h2: `I Built a Workout Tracker in a Single HTML File`
- p: Short description
- Read More span

**Step 2: Add cross-links to existing posts**

In each existing blog post, before the CTA, add a "Read Next" section linking to 1-2 related posts. Use a simple styled link block:

```html
<h2>Read Next</h2>
<p><a href="/blog/ymca-dumbbell-workout.html" style="color:var(--orange);">Dumbbell Workout at the YMCA</a></p>
<p><a href="/blog/progressive-overload-dumbbells.html" style="color:var(--orange);">How to Do Progressive Overload With Fixed Dumbbells</a></p>
```

Match the cross-links to relevant content:
- `dumbbell-5x5-program.html` links to: YMCA workout, progressive overload
- `stronglifts-dumbbells.html` links to: dumbbell 5x5 program, YMCA workout
- `free-workout-tracker.html` links to: single HTML file post, dumbbell 5x5 program

**Step 3: Commit**

```bash
git add blog/
git commit -m "update blog index with new posts and add cross-linking"
```

---

## Task 7: Service Worker Cache Bump

**Files:**
- Modify: `sw.js:1` (bump CACHE_NAME)

**Step 1: Bump cache**

Change `dumblifts-v18` to `dumblifts-v19`.

**Step 2: Commit**

```bash
git add sw.js
git commit -m "chore: bump service worker cache to v19"
```

---

## Summary

| Task | Type | Files |
|------|------|-------|
| 1. robots.txt + sitemap.xml | Create | 2 new files |
| 2. CSV export | Feature | index.html |
| 3. YMCA blog post | Content | 1 new file |
| 4. Progressive overload post | Content | 1 new file |
| 5. Single HTML file post | Content | 1 new file |
| 6. Blog index + cross-links | Modify | 4 existing files |
| 7. Cache bump | Chore | sw.js |

**After deployment (manual):**
- Set up Google Search Console
- Submit sitemap
- List on AlternativeTo, Product Hunt, IndieHackers, PWA directories
