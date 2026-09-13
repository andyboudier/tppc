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

## Sign-in and roles (switched off for the clubs)

`src/auth.js` defines a small `window.auth` contract the app reads the way it
reads `window.storage`. The default provider it installs is **sign-in off**:
nobody logs in, anyone may book, the captain PIN opens everything — the app as
the clubs have always run it. Keep it that way here unless the club asks.

With a provider installed (the PoloACT demo does this with Firebase Auth):
`captainMode` means *admin* (rosters, draw, players, tournaments, shop,
payments), `canScore` (the PIN, or an admin) gates live scoring only, and a
signed-in member books as themselves and can remove only their own entry.
`src/AuthSheet.jsx` is the sign-in sheet and the Admins panel. Both files are
in the demo's resync list.

When touching gated UI: management → `captainMode`; live-scoring entry →
`canScore`; the raw PIN state is `pinUnlocked` and should not gate anything
else directly.

A signed-in member is matched to the player database on email (`myPlayer`).
Player records carry a free-text `team`; a member may book themselves or
anyone sharing their team (`teammates`), never a typed name (`memberBooking`).
Roster and waiting-list entries then carry `playerId` and, for a teammate,
`bookedBy`; `canRemoveEntry` decides who may take an entry off — the member
themselves and their teammates, however the entry got there, matched on
`playerId` or, for older and captain-typed entries, on name. Taking a
teammate off asks first (`removeWithCare`); taking yourself off does not. The player
editor's Admin switch writes the admins list through `window.auth.setAdmins`
(`adminEmails` / `isAdminEmail`); the team field is a dropdown of existing
teams (`teamNames`) with a "new team" input.

Grounds can carry a location: `groundPins.js` parses a pasted Google Maps
link or the phone's own position, and the pin is stored once per ground name
in the shared key `ground-pins`. Each app also ships `DEFAULT_GROUND_PINS`
beside its `GROUND_OPTIONS` — the club's real coordinates, built through
`builtInPins()` — so directions work before anyone pins anything. `pinOf` is
`pinOr(groundPins, DEFAULT_GROUND_PINS, name)`: a club-set pin wins, and
removing it reverts to the built-in rather than to nothing. Members get a 📍 to directions wherever the
ground is named, and the link rides along in the WhatsApp text. Captains set
them from 📍 Locations by the ground picker. No Maps API key is involved, by
design — there is no embedded map.

Outgoing email for all four apps goes through one route on the PoloACT hub
(`app/api/tournament-entry`, sending via `lib/mail.ts` → Resend). An app names
itself with `CLUB_ID` and the hub maps that to an office address through
`CLUB_RECIPIENTS`; addresses never travel in the request. Adding a club is an
entry in that map, not code.

### Things that differ between the apps, and must not be "fixed"

- Sign-in is on only in the **demo**; the three clubs run with `window.auth` at its default (off).
- Only **TPPC** still has a programme front sheet. Druids and Vaux open straight
  onto the running order, so anything cover-page-shaped applies to TPPC alone.
- Vaux's programme is the tournament-times card: black, Oswald, one page per day.
- Day-suffixed storage keys differ: TPPC and Vaux use a bare key for Wednesday
  and `<base>-<day>` otherwise; Druids always suffixes.
- Each club sets its own palette, so anchors that include a colour need matching
  loosely when mirroring.
