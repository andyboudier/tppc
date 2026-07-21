# Architecture & Developer Guide

A contributor-facing reference for the TPPC Chukkas app. Read the
[README](../README.md) first for the high-level picture and the
[Domain Rules](DOMAIN_RULES.md) doc for the polo maths.

All paths below are relative to `polo-chukkas-deploy/`. Run every command from
there.

---

## Stack at a glance

- **React 18 + Vite** — a Progressive Web App (installable from the browser).
- **Firebase Firestore** (project `tedworth-park-polo`) — public reads/writes,
  live cross-device sync.
- **Capacitor 8** — wraps the same web app as native **iOS** and **Android** apps.
- **jsPDF** — client-side PDF programme generation, with an embedded Jost font.
- No test runner and no backend of our own: everything is client-side, and
  Firestore is the only server.

---

## Module map (`src/`)

| File | Size | Responsibility |
|---|---|---|
| `main.jsx` | tiny | React entry point. Imports `./storage` for its side effect (attaching `window.storage`) before rendering `<PoloChukkas />`. |
| `firebase.js` | tiny | The `firebaseConfig` object and initialised `app` / `db` for project `tedworth-park-polo`. |
| `storage.js` | ~120 lines | Firestore-backed key/value store exposed as `window.storage`, plus the live-sync listeners. **The heart of cross-device sync.** |
| `PoloChukkas.jsx` | ~7,700 lines | The entire app — one big component. Almost every feature lives here. |
| `tournamentPdf.js` | ~90 KB | PDF programme generation **and** the canonical handicap/head-start logic (`teamHandicap` is exported and imported back into `PoloChukkas.jsx`). |
| `pdfFonts.js` | ~120 KB | Four Jost subset styles embedded as base64, lazy-loaded on first PDF. Replaces Helvetica/Times so PDFs render identically everywhere. |
| `liveScoreActivity.js` | ~55 lines | Thin bridge to the native iOS Live Activity plugin. Every function is a safe no-op off iOS. |

Because `PoloChukkas.jsx` is one enormous component, work by feature, not by file
region. The tables below give the state variables and function names that anchor
each feature so you can jump straight to them.

### Navigating `PoloChukkas.jsx`

Top-level UI is a six-tab layout. Tab state is `activeTab` (the tab bar renders
around line 4465):

| Tab | `activeTab` | Public? | What it is |
|---|---|---|---|
| Chukkas | `'chukkas'` | Yes | Per-day booking/sign-up, roster, and the drawn chukkas. |
| Fixtures | `'fixtures'` | Yes | Tournament fixtures, match details, team sign-ups, PDF triggers. |
| Live Game | `'live'` | Yes (read-only) | Live scoreboard; captains enter scores. |
| Shop | `'shop'` | Captain only | Club shop preview. |
| Players | `'players'` | Captain only | Player database, subsidies, lessons, checkout. |
| Teams | `'teams'` | Captain only | Team database. |

The selected day within Chukkas is a separate state, `activeDay`, keyed by
`DAY_KEYS = ['wed','thu','fri','sat','sun']`. `activeTab` and the live selection
are persisted to `localStorage` so a refresh returns to the same screen.

---

## Storage & live-sync model

This is the most important thing to understand before touching persistence.

### The `window.storage` API

`storage.js` replaces the original artifact's in-memory `window.storage` with a
Firestore-backed implementation that keeps the **exact same API** so
`PoloChukkas.jsx` uses it unchanged:

```js
window.storage.get(key, shared?)      // → { key, value, shared } | null
window.storage.set(key, value, shared?)
window.storage.delete(key, shared?)
window.storage.list(prefix?, shared?) // → { keys, prefix, shared }
```

- `shared = true` → the Firestore `shared` collection (club-wide data).
- `shared = false` (default) → the `private` collection.
- Each key is one Firestore document holding `{ value }`.

An in-memory `Map` caches values so `get()` is synchronous-fast after the first
read; the live listeners keep that cache current.

### Live cross-device sync

`storage.js` opens an `onSnapshot` listener for **every key in `SYNC_KEYS`**. When
any device writes, Firestore pushes the change to all listeners, which:

1. update the in-memory cache, and
2. dispatch a `window` event `storage-changed` with `{ detail: { key } }` so React
   components re-read and re-render.

**Critical rule:** a persistent *shared* key only syncs across devices if it
appears in `SYNC_KEYS`. Add a new shared key to the app? Add it to `SYNC_KEYS` in
`storage.js` in the same change, or it silently won't sync.

Per-day keys follow a naming scheme: `base` for Wednesday, `base-<day>` for the
others (e.g. `roster`, `roster-thu`, `schedule-sat`). The `perDay(base)` helper in
`storage.js` expands a base name across days.

> **Caveat — Friday sync.** The app's `DAY_KEYS` includes `'fri'`, but
> `storage.js`'s `DAYS` array (which drives `perDay`) is
> `['wed','thu','sat','sun']` — Friday is **not** in it. So Friday's per-day shared
> keys (`roster-fri`, `schedule-fri`, `throwin-fri`, …) are not currently in
> `SYNC_KEYS` and won't live-sync across devices. If Friday chukkas need
> cross-device sync, add `'fri'` to `DAYS` in `storage.js`. Verify against the
> current code before relying on this.

### Automatic backups

Match details and live scores are the most edit-heavy, loss-sensitive data, so
`PoloChukkas.jsx` keeps gzip-compressed snapshots (retention: `MAX_BACKUPS = 100`)
in a single Firestore record:

- `writeBackup` / `scheduleBackup` — snapshot on change (debounced).
- `loadBackups` / `restoreBackup` — list and restore from the captain UI
  (`showBackups` state).
- `recoverScoresFromBackups` — targeted score recovery.

`storage.js` also caps its own backup snapshots at 100.

---

## Native apps (Capacitor)

`capacitor.config.ts` defines the native shell:

- `appId: uk.co.tedworthparkpolo.chukkas`, `appName: TPPC Chukkas`.
- **Remote-load wrapper:** `server.url = https://tppc-chukkas.vercel.app`. The
  installed app loads the live web app rather than a bundled copy, which is why web
  changes reach installed iOS apps in ~90s with no rebuild. To revert to a
  local bundle (friendlier for App Store review), comment out the `url` + cleartext
  lines and ship `webDir: dist`.
- Splash / status bar are configured on a cream (`#f4ecd8`) background; the iOS
  content background is club claret (`#6b1f2a`).

### iOS Live Activity

`liveScoreActivity.js` wraps a native plugin (`LiveScoreActivity`) registered via
`@capacitor/core`. It exposes `liveScoreSupported`, `startLiveScore`,
`updateLiveScore`, `endLiveScore`. Off iOS every call is a no-op, so the same code
runs safely on web and Android.

In `PoloChukkas.jsx`, the live-scoring screen builds a `liveActivitySnapshot`
(team names, scores, a status string like "2nd chukka" / "Full time", `isLive`) and
an effect starts/updates/ends the Lock-Screen / Dynamic-Island activity as that
snapshot changes.

### Local notifications (iOS)

`@capacitor/local-notifications` is used for chukka reminders (`refreshLocalReminders`,
IDs `7000`–`7999`). For each upcoming session with sign-ups it schedules a
throw-in reminder ~2h before and a sign-ups-closing reminder ~3h before the cutoff.
Guarded on native + plugin present; inert on web/Android. There is **no** web push.

---

## Deploy pipeline

| Target | Trigger | Latency | Notes |
|---|---|---|---|
| Live web app | Push to `main` (Vercel auto-deploy) | ~90s | Also updates installed iOS apps via the remote-load wrapper. |
| PR preview | Any branch/PR (Vercel) | ~90s | **Check this before merging.** |
| iOS native (splash, plugins, Live Activity) | Next iOS build | Xcode Cloud → TestFlight | Does **not** ride the ~90s path. |
| Android `.aab` | Manual `workflow_dispatch` | GitHub Actions | `.github/workflows/android-release.yml`; download the artifact, upload to Play Console. |

This tool opens PRs on a working branch; a human merges to `main` to trigger the
production web deploy.

### Cache headers — do not break the ~90s path

`vercel.json` is what makes remote-load-with-instant-updates work:

- `/`, `/index.html`, `/manifest.webmanifest` → `no-cache, no-store,
  must-revalidate`. The HTML shell is always re-fetched, so a new build's hashed
  asset references are picked up immediately.
- `/assets/(.*)` → `public, max-age=31536000, immutable`. Vite fingerprints these
  filenames, so caching them forever is safe.

Any app-shell / service-worker caching work **must preserve this behaviour** — if
the shell HTML gets cached, installed apps stop receiving the ~90s web update.

---

## Build & validate

```bash
npm install                                                   # deps
esbuild src/PoloChukkas.jsx --loader:.jsx=jsx --outfile=/dev/null   # fast JSX check
npm run build                                                 # production build → dist/
```

- **Verify logic in Node, not in the PDF.** For handicap/scheduling/scoring changes
  write a small Node simulation. Do **not** grep raw PDF output: special characters
  (`½`, `–`) are encoded as WinAnsi bytes, so UTF-8 substring search on the raw PDF
  is unreliable. `teamHandicap` is exported from `tournamentPdf.js` and can be
  imported into a scratch Node script directly.

---

## Gotchas

- **Never add `@capacitor/filesystem` or `@capacitor/share`.** They break Xcode
  Cloud's committed `Package.resolved`.
- **Edit `package.json` surgically.** It carries local Capacitor entries that a
  wholesale rewrite would clobber.
- **PDF encoding:** see the Node-verification note above.
- **Shared keys must be registered:** every persistent shared key belongs in
  `SYNC_KEYS` (`storage.js`) or it won't sync.
- **Divisions need a real `division` field**, not the consecutive-match label
  trick (which only works when matches are adjacent) — see
  [Domain Rules](DOMAIN_RULES.md).
- **Two copies of the head-start formula** exist — one in `PoloChukkas.jsx`
  (`liveHeadStart`) and one in `tournamentPdf.js` (`pdfHeadStart`). Change one, change
  both, or the live screen and the printed programme disagree.

---

## Never

- **Never commit secrets** — API tokens, keys, or the captain PIN — to the repo.
  The Firebase web config in `firebase.js` is a public client config (safe to ship);
  the captain PIN is a soft gate and must still never live anywhere public beyond
  the already-shipped client, and never in commit messages, PR bodies, or docs.
</content>
