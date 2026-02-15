# DUMBLIFTS SEO & Growth -- Design

**Date:** 2026-02-15
**Approach:** Technical SEO foundation + new content + CSV export + housekeeping

## Context

DUMBLIFTS is live at dumblifts.com but not indexed by Google (site: search returns zero results). No robots.txt, no sitemap.xml, no Google Search Console. Three blog posts exist but can't be found. Reddit self-promotion was immediately removed. Goal is "just for fun" -- make the app findable by people who'd genuinely want it.

## 1. Crawlability

**New files:**
- `robots.txt` -- Allow all crawlers, point to sitemap
- `sitemap.xml` -- List all pages (homepage, blog index, 3 existing posts, 3 new posts)

**Manual step (not code):**
- Set up Google Search Console, verify ownership via Netlify DNS
- Submit sitemap URL
- Request indexing of homepage

## 2. New Blog Content (3 posts)

All posts: no em dashes, natural voice, CTA linking to the app.

1. **"Dumbbell Workout at the YMCA: A Simple 5x5 Routine"**
   - Keywords: "YMCA dumbbell workout", "gym workout with dumbbells only"
   - Angle: Authentic -- the app was built for YMCA fixed dumbbells

2. **"How to Do Progressive Overload With Fixed Dumbbells"**
   - Keywords: "progressive overload dumbbells", "fixed dumbbell progression"
   - Angle: The 5lb jump problem, deload protocol, when to move up

3. **"I Built a Workout Tracker in a Single HTML File"**
   - Keywords: "simple PWA", "single file web app"
   - Angle: Tech/indie hacker audience, shareable on HN/IndieHackers/r/SideProject

## 3. Internal Linking

- Each blog post links to at least one other blog post
- Every blog post has a CTA linking to the app homepage
- Blog index updated with new posts

## 4. CSV Export

Add "Export CSV" button alongside existing JSON export in the Program tab data section.

**Format:**
```
Date,Workout,Exercise,Weight,Unit,S1,S2,S3,S4,S5
"Mon Feb 10 2026","Workout A","Goblet Squat",35,"lb",5,5,5,5,5
```

One row per exercise per workout. Flattens history array into spreadsheet-friendly format.

## 5. Commit CLAUDE.md

Currently untracked. Stage and commit so project instructions are version-controlled.

## 6. Directory Listings (Manual, not code)

Checklist for after deployment:
- [ ] Google Search Console -- verify + submit sitemap
- [ ] AlternativeTo -- list as alternative to Strong, JEFIT, Hevy
- [ ] Product Hunt -- launch post
- [ ] IndieHackers -- Products section listing
- [ ] PWA directories (appsco.pe, progressivewebapps.store)

## Files Modified/Created

- Create: `robots.txt`
- Create: `sitemap.xml`
- Create: `blog/ymca-dumbbell-workout.html`
- Create: `blog/progressive-overload-dumbbells.html`
- Create: `blog/single-html-file-workout-tracker.html`
- Modify: `blog/index.html` (add new posts)
- Modify: `blog/*.html` (cross-linking between posts)
- Modify: `index.html` (CSV export function + button)
- Modify: `sw.js` (bump cache, add new files to precache)
- Commit: `CLAUDE.md`

## Out of Scope

- Paid advertising
- Social media accounts
- App store listings
- Community seeding strategy (user handles this organically)
