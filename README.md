# DumbLifts — Deployment Guide

## What's in this folder
```
dumblifts/
├── index.html      ← The app (HTML/CSS/JS all-in-one)
├── manifest.json   ← PWA manifest (name, icons, theme)
├── sw.js           ← Service worker (offline caching)
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

## Deploy to Netlify

1. Go to https://app.netlify.com and sign up / log in (GitHub login is easiest)
2. From the dashboard, click **"Add new site"** → **"Deploy manually"**
3. **Drag the entire `dumblifts` folder** onto the upload area
4. Wait ~10 seconds — your site is live at a random `.netlify.app` URL

## Connect your domain (dumblifts.com)

1. In Netlify: **Site settings** → **Domain management** → **Add custom domain**
2. Type `dumblifts.com` and confirm
3. Netlify will give you DNS records. Go to **Porkbun**:
   - Log in → **Domain Management** → click `dumblifts.com` → **DNS**
   - Delete any existing A or CNAME records for the root domain
   - Add the records Netlify tells you (usually an A record pointing to `75.2.60.5` or a CNAME)
   - Also add `www` as a CNAME pointing to your Netlify site
4. Back in Netlify, click **Verify** — it may take 10-30 min for DNS to propagate
5. Netlify auto-provisions a free SSL certificate once DNS is verified

## Add to iPhone Home Screen

Once deployed, on your iPhone:
1. Open Safari → go to `dumblifts.com`
2. Tap the Share button (square with arrow)
3. Scroll down → **"Add to Home Screen"**
4. It'll launch full-screen like a native app with the orange dumbbell icon

## Updating the app

To push changes:
1. In Netlify: **Deploys** → **Drag and drop** the updated folder
2. Users will get the new version on next visit (service worker updates automatically)

If the service worker cache is sticky, bump `CACHE_NAME` in `sw.js` from `dumblifts-v1` to `v2`, etc.
