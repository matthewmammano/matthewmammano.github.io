# Archived site versions

This folder holds old snapshots of the site. The current/live version stays
at the repo root, as normal — everything here is historical only.

## Layout per version

```
version/
  _shared/
    topbar.css   <- one shared black topbar style, used by every version
    topbar.js    <- reads that version's meta.json and fills the topbar
  N/
    meta.json    <- {"date": "...", "creator": "...", "notes": "..."}
    index.html   <- thin wrapper: topbar + <iframe src="site.html">
    site.html    <- the actual archived page, byte-for-byte as it originally was
    (everything else: original assets, css, js — untouched)
```

`index.html` is the one you link to / browse to — it shows the black info bar
up top (created date, creator, optional notes) and loads the real old site
underneath in an iframe. `site.html` is never edited except to fix something
actually broken (missing asset, dead layout bug) — cosmetic/behavioral
changes to the archived page itself are avoided so it stays a true snapshot.

## Adding a new archived version

1. Pick the next number `N` (versions are numbered oldest → newest,
   chronological; the live root site is always newer than the highest `N`).
2. Drop the old site's files into `version/N/`, with the entry file named
   `site.html` (rename it if it was `index.html`, `index.php`, etc. —
   convert `.php` to static `.html` only if needed, and only mechanically:
   strip server-side-only code, inline includes, no behavior changes).
3. Add `version/N/meta.json`:
   ```json
   {
     "date": "Month Year",
     "creator": "Matthew Mammano",
     "notes": "a few optional words"
   }
   ```
4. Add `version/N/index.html`, copying the wrapper pattern from any existing
   version (topbar + `<iframe src="site.html">`), pointing at
   `../_shared/topbar.css` and `../_shared/topbar.js`.
5. Don't duplicate the topbar CSS/JS per folder — always reference the
   shared files in `version/_shared/`.
