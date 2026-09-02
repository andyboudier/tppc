# TPPC Chukkas — working notes for Claude

This repo (`andyboudier/tppc`) holds the **Tedworth Park Polo Club** chukkas app.
The web/PWA app lives in `polo-chukkas-deploy/` (single large React component,
`src/PoloChukkas.jsx`, backed by Firestore via `src/storage.js`). iOS ships via
Xcode Cloud → TestFlight; Android via the `.github/workflows/android-release.yml`
GitHub Action.

## Keep all four apps in sync

TPPC is one of **four near-identical apps** — three clubs and the PoloACT demo:

| App    | Repo                  | Main component file                       |
|--------|-----------------------|-------------------------------------------|
| TPPC   | `andyboudier/tppc`    | `polo-chukkas-deploy/src/PoloChukkas.jsx` |
| Druids | `andyboudier/druids`  | `druids-app/src/DruidsApp.jsx`            |
| Vaux   | `andyboudier/vaux`    | `vaux-poloact/src/VauxPoloACT.jsx`        |
| Demo   | `andyboudier/PoloACT` | `poloact-demo/src/PoloChukkas.jsx`        |

The codebases are the same source with different branding, so a change to one
usually applies cleanly to the others.

**Rule: TPPC is the source of truth. Every change to the TPPC app is mirrored to
Druids, Vaux and the demo wherever it applies — without asking.** Apply the
equivalent edit to each repo (add each with the repo tools if it isn't already in
the session), verify each builds, and open a PR per repo. If a change genuinely
does not apply to one of them, say so and why rather than skipping it silently.

The demo is not hand-patched: it is re-derived by running
`poloact-demo/resync-from-tppc.mjs /path/to/tppc/polo-chukkas-deploy`, which
copies the shared source and re-applies the PoloACT palette and names. The files
that ARE the demo — `storage.js`, `trophyStore.js`, `demoSeed.js`,
`DemoChrome.jsx`, `main.jsx`, `index.html`, `vite.config.js` — are left alone,
because they are the demo's browser-backed replacements for Firestore.

### Things that differ between the apps, and must not be "fixed"

- Only **TPPC** still has a programme front sheet. Druids and Vaux open straight
  onto the running order, so anything cover-page-shaped applies to TPPC alone.
- Vaux's programme is the tournament-times card: black, Oswald, one page per day.
- Day-suffixed storage keys differ: TPPC and Vaux use a bare key for Wednesday
  and `<base>-<day>` otherwise; Druids always suffixes.
- Each club sets its own palette, so anchors that include a colour need matching
  loosely when mirroring.
