# TPPC Chukkas — working notes for Claude

This repo (`andyboudier/tppc`) holds the **Tedworth Park Polo Club** chukkas app.
The web/PWA app lives in `polo-chukkas-deploy/` (single large React component,
`src/PoloChukkas.jsx`, backed by Firestore via `src/storage.js`). iOS ships via
Xcode Cloud → TestFlight; Android via the `.github/workflows/android-release.yml`
GitHub Action.

## Working preference: do it, don't hand it back

When a connector or tool gives direct access to a service — GitHub, Vercel,
Firebase, Resend, Stripe, Microsoft 365, DNS — **do the step yourself** rather
than writing instructions for the owner to follow. Hand a step back only when
no available tool can do it (and say which tool is missing), when it needs a
secret that must not pass through the chat, or when it is destructive or
irreversible enough to confirm first (deleting data, wiping DNS, spending money,
publishing to the live clubs). Check the result afterwards either way.

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

All three clubs now also ship `src/authFirebase.js`, a real Firebase Auth
provider on the club's own project. It is **dormant**: `SIGN_IN_LIVE` is false, so
it reports `enabled: false` and every `auth.enabled` gate in the app behaves
exactly as before. `src/SignInTest.jsx` is the bench that exercises it, sitting
above the diary on the captain-only **Lessons** tab; it hands `AuthSheet` a
snapshot with `enabled: true`, which is what makes the real sheet usable while
the app at large still has sign-in off. Going live is that one constant plus
enabling the providers in the club's Firebase console — until then a method
returns `auth/operation-not-allowed`, which `authErrorText` renders plainly.

The clubs offer **Google, Apple, email and password, and an emailed sign-in
link** — email either way, a password for those who want one and a link for
those who would rather not keep one. Password and link are the *same* provider
in the Firebase console (Email/Password, with "Email link" a second switch
beneath it), so enabling one does not enable the other. `SIGN_IN_METHODS`
should name only what is switched on in that club's console; a button for a
method that is off is a dead end.

`accountLink.js` joins a signed-in account to the club's own player record, and
is pure so it can be tested directly. The cascade is **linked account → email →
mobile → name**, strongest first. The link (`uid` on the player record) is
written down the first time a match is found, together with `authProviders` and
`linkedBy` — the rung it was originally matched on, kept because every later
match reads as "the linked account" and a captain checking a doubtful one wants
to know whether it began as an email or as a name. A rung that matches two
players picks neither and reports both: guessing is how one member books under
another's name. Match against the account **and the profile**, because Google
gives an email and a name but never a number, and Apple's Hide My Email gives an
address the club has never seen — without the profile the mobile and name rungs
reach nobody.

`savePlayer` is an explicit whitelist, so `uid`, `authProviders` and `linkedBy`
are named there or a captain's next save wipes the link. The player editor's
**Sign-in account** panel is where a captain unlinks, relinks to the account
signed in now, and merges a duplicate. `mergePlayers` keeps the primary's id
because rosters, waiting lists, lesson bookings and transactions all point at
it — and `mergePlayerInto` re-points whatever the duplicate had collected, or
the merge would quietly detach somebody's chukkas and their invoices. The merge
is field-agnostic on purpose: TPPC has `military` and `team`, Druids has
`student` and neither, and naming fields would drop one or invent another.
Druids and Vaux have **no waiting list**, so that step is TPPC's alone.

Firebase keeps one account per email, so a member who signed up with Google and
later taps Apple is refused. The sheet answers with the way they used the first
time; `fetchSignInMethodsForEmail` returns nothing on a project with
email-enumeration protection on, so the club's own `authProviders` is the
fallback and is usually the better source. `linkProvider` is the fix — adding
the second way to the same account, never a second account.

A member's profile and the club's player record are kept in step by **one
reconcile** that runs in whichever direction was edited last — both halves
matter, and for a while only one of them was there. A member's edit has to
reach the record or the change looks accepted while the draw never hears about
it; a captain's correction has to reach the profile or the member opens Edit
profile on a stale handicap and saving from there puts the old value back.
**Last edit wins**, compared on `profile.updated` against the record's
`updatedAt`, and the copy is written with the **source's** timestamp so the two
end up equal — stamping it with the time of day instead would make every sync
look like a fresh edit and bounce the two forever. That is why `saveProfile`
takes an optional `updated` rather than always using `Date.now()`, in
`authFirebase.js` and in the demo's `authLocal.js` alike. Only what the member
owns travels: name, handicap and mobile, never the email, which is the
account's and is what the match runs on. The record seeding the profile is the
same reconcile, so a member the club already knows is never asked for details —
the first-sign-in prompt is for strangers only. And `SignInTest`'s Edit profile must pass
`startAt="profile"` — AuthSheet only jumps there by itself when the profile has
no name yet, so without it an already signed-in captain is asked to sign in
again.

**Sign-in links and password resets are sent by Firebase, not by the app** —
there is no code path here to change who sends them. They go through Resend
from `hello@poloact.co.uk` by setting **custom SMTP** in each club's Firebase
console (Authentication → Templates → Customize SMTP settings):
`smtp.resend.com`, port 587 with STARTTLS (465 for implicit SSL), username
`resend`, password a Resend API key, sender `hello@poloact.co.uk`. It is per
project, so it is done three times. poloact.co.uk is already verified in Resend
for the hub's own mail (`lib/mail.ts`, `MAIL_FROM`), so no new DNS is needed.
Doing it instead through the hub would mean the Admin SDK generating the links
and `sendMail` posting them — more control over the HTML, and a service-account
key per club in Vercel.

The auth SDK is ~37 kB gzipped, so nothing loads it on a member's cold start:
`SignInTest` imports `authFirebase` dynamically (a static import also breaks the
demo, whose `firebase.js` may have no project configured), `vite.config.js`
gives `firebase/auth` its own `firebaseAuth` chunk, and `main.jsx` only pulls it
in early when `signInReturning()` says this load is the tail of a redirect or an
emailed link. Import named functions from `firebase/firestore`, never a
namespace — `import * as` there put 36 kB gzipped back into the chunk everyone
loads.

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

The club notice is one shared document, `notice`, shown as a banner under the
tab bar on every tab (`NoticeBanner.jsx`, shape and helpers in `notices.js`,
both in the demo's resync list). Two levels: **normal** is quiet, in the club's
colours, and a member can dismiss it (remembered per device against
`noticeStamp`, so an edited notice shows again); **important** is red, carries
`role="alert"` and cannot be dismissed. A notice may expire at the end of the
day or the week — the captain's device works the moment out, so every viewer
agrees on it. The editor is the banner itself, behind `captainMode`, so there
is no settings screen to find. The banner hides in stage mode with the
masthead and tabs.

The three clubs' Watch apps show the notice too, above their tabs — `Notice`,
`NoticeStore`, `NoticeBanner` and `NoticeDetail` in each
`ios/App/<club> Watch Watch App/ContentView.swift`. No push is involved: the
Watch already reads `shared/<key>` from the Firestore REST API, so this is one
more fetch of the same document. Two lines with the whole notice on a tap, and
no dismiss on the wrist. Push notifications proper are **not** wired anywhere:
`@capacitor/push-notifications` is a dependency and `capacitor.config.ts`
declares options, but there is no entitlement, no `aps-environment`, no
`registerForRemoteNotifications`, and nothing stores tokens or sends. The
Live Activity is local too (`pushType: nil`). The demo has no native project,
so nothing Watch-shaped applies to it.

Coaching lessons live behind a captain-only **Lessons** tab (`lessons.js` for
the model, `LessonsBoard.jsx` for the diary; both in the demo's resync list,
shared key `lesson-slots`). A slot is a *window* — "the coach is free 13:00 to
15:00" — and a booking claims a sub-range of it, so a two-hour window offers
1hr, 2hr or the second 1hr. Individual bookings own their range; group ones
stack in the same range up to `maxGroup`, and below `minGroup` (4) are shown as
not yet viable rather than blocked. Captains add or amend windows, copy last
week forward (times only, never bookings) and book people in by hand.

Each club prices from its **own** rate card, so `LESSON_SLOT_RATES` maps
(kind, hours) → that club's lesson id and lives in each app, not in
`lessons.js`: Druids sells `lesson-1hr` and `semi-private` where TPPC and Vaux
sell `ind-1hr`/`grp-1hr`, and a shared map would quietly bill the wrong lesson.
A length the card does not price is not offered at all. Pony hire is charged
per hour, as it is per chukka, and is ticked by default.

TPPC also sells its own **club sessions** from the Lessons tab — Ladies Only
and Instructional Chukkas, one hour, two chukkas, eight places. A slot with a
`kind` is a session rather than a coaching window: it is booked whole, never
sliced by the hour, and `normaliseSlot` switches its individual/group flags off
so the window machinery cannot sell sub-ranges of it. Nothing ties a session to
a weekday — the captain adds one on any date and can run several — and Copy
last week carries sessions forward without their riders. The catalogue,
`CLUB_SESSIONS`, lives in the app beside `LESSON_SLOT_RATES` and for the same
reason. Each entry names the chukka day it **is** (`dayKey`), and the price goes
through `priceBooking` with that day, so a session costs exactly what the same
evening costs on the Chukkas tab: Instructional is the rate card's flat
£110/£105 with the pony in it, Ladies Only is the ordinary tariff for two
chukkas. No session price is restated anywhere. The day's `maxHandicap` gate
applies too. Sessions are invoice-only — a token buys an hour of *coaching*, and
spending one on chukkas unasked is not the app's call. `CLUB_SESSIONS` must stay
below `DAY_CONFIG`: it reads the start-time constants at load. Druids and Vaux
ship the same `lessons.js` and `LessonsBoard.jsx` but pass no catalogue, and
with none the board is exactly as it was.

Payment is a token wallet that falls back to an invoice: `tokens` on the player
record (one token buys an hour) is spent when the player has enough, otherwise
the cash price raises the same `'due'` transaction the Payments tab already
settles. Cancelling returns the token, or removes the invoice if it is still
unpaid. Note `savePlayer` builds an **explicit whitelist** — a field not named
there is dropped on every save.

The tab strip is three member tabs — Chukkas, Fixtures, Live Game — plus
**More**, which holds the captain area (Lessons, Players, Payments, Teams,
Shop). `CAPTAIN_ONLY_TABS` are the tabs a captain alone may sit on, so a
restore or a locked PIN bounces off them; `CAPTAIN_TABS` adds `'more'`, which
a member may open to find the PIN, and is what keeps More lit inside an area.
Add a captain area to both. Payments deep-links to Players with
`playersView = 'checkout'`.

On a phone (`max-width: 640px`) the same nav markup is restyled into a fixed
bottom bar with icons — one nav, one state, no second copy to keep in step.
Anything else fixed to the bottom must clear it: `.app-main` and `.app-footer`
carry the padding (the footer is outside `main`), and `.refresh-fab` is lifted,
or it sits on top of the More tab and makes it untappable. Vaux's active tab is
`--cream` where the others are `--gold`.

Outgoing email for all four apps goes through one route on the PoloACT hub
(`app/api/tournament-entry`, sending via `lib/mail.ts` → Resend). An app names
itself with `CLUB_ID` and the hub maps that to an office address through
`CLUB_RECIPIENTS`; addresses never travel in the request. Adding a club is an
entry in that map, not code.

## TPPC-Dev: the design clone

`andyboudier/tppc-dev` is a clone of this repo, with TPPC's full history,
served at **tppc-dev.poloact.co.uk** by its own Vercel project (`tppc-dev`) on
its own Firebase project. It exists for significant design work that is then
brought back here and mirrored to Druids, Vaux and the demo as usual. Because
the histories are shared, bringing it back is a git merge — add tppc-dev as a
remote here and merge its branch — not a copy of files.

One source, two databases: `firebase.js` takes its config from
`VITE_FIREBASE_*` when a build sets them and falls back to the live project
when it does not, so the club's own build is unchanged and the file is identical
in both repos. `appEnv.js` decides whether this copy is the dev one
(`VITE_APP_ENV=dev`, or a `tppc-dev` host), and the dev copy says DEV on every
screen and asks not to be indexed. A dev build pointed at the live project
**refuses to start** and says so on the screen — the one mistake that must be
impossible is design work clearing a real roster. Keep that guard.

The dev database was seeded once from the live `shared` collection. Nothing
flows back: never copy dev data to the live project. TPPC's tournament entry is
in form mode with no hub endpoint, so the dev app emails no club office. There
is no dev iOS or Android build — Xcode Cloud is connected to this repo only, and
the Android workflow runs by hand. None of this applies to Druids or Vaux, which
have no dev clone.

### Things that differ between the apps, and must not be "fixed"

- Sign-in is on only in the **demo**. The three clubs ship the real provider
  but dormant (`SIGN_IN_LIVE` false), so they behave exactly as `window.auth`
  at its default does; only the captain's bench on Lessons drives it.
- Only **TPPC** still has a programme front sheet. Druids and Vaux open straight
  onto the running order, so anything cover-page-shaped applies to TPPC alone.
- Vaux's programme is the tournament-times card: black, Oswald, one page per day.
- Day-suffixed storage keys differ: TPPC and Vaux use a bare key for Wednesday
  and `<base>-<day>` otherwise; Druids always suffixes.
- Each club sets its own palette, so anchors that include a colour need matching
  loosely when mirroring.
