# TPPC Chukkas — working notes for Claude

This repo (`andyboudier/tppc`) holds the **Tedworth Park Polo Club** chukkas app.
The web/PWA app lives in `polo-chukkas-deploy/` (single large React component,
`src/PoloChukkas.jsx`, backed by Firestore via `src/storage.js`). iOS ships via
Xcode Cloud → TestFlight; Android via the `.github/workflows/android-release.yml`
GitHub Action.

## Keep the three club apps in sync

TPPC is one of **three near-identical sibling apps**, each in its own repo:

| Club  | Repo                 | Main component file                     |
|-------|----------------------|-----------------------------------------|
| TPPC  | `andyboudier/tppc`   | `polo-chukkas-deploy/src/PoloChukkas.jsx` |
| Druids| `andyboudier/druids` | `druids-app/src/DruidsApp.jsx`          |
| Vaux  | `andyboudier/vaux`   | `vaux-poloact/src/VauxPoloACT.jsx`      |

The codebases are the same source with different branding, so a change to one
usually applies cleanly to the others.

**Rule: TPPC is the source of truth. Whenever a change is made to the TPPC app,
ask the user whether they want the same change mirrored to Druids and Vaux
before finishing.** The user wants the three apps kept in sync where possible.
If they say yes, apply the equivalent edit to each sibling repo (add each with
the repo tools if it isn't already in the session), verify it builds/parses,
and open a PR per repo. If they say no, note that the apps have diverged.
