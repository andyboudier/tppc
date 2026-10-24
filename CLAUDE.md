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
because rosters, waiting lists and lesson bookings all point at it — and
`mergePlayerInto` re-points whatever the duplicate had collected, or the merge
would quietly detach somebody's chukkas and lessons. The merge
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
rate card), `canScore` (the PIN, or an admin) gates live scoring only, and a
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

**Tournament entry is priced from the rate card.** A fixture may be tagged
`military` (a tick box in the fixture editor; a Military badge on the card): a
military tournament is the rate card's flat military team fee for its length,
whoever plays. Otherwise each named player carries a share of their own
category's team fee (`priceTeamEntry`): with four players, two members and two
non-members pay half the member fee plus half the non-member fee, so a mixed
team's fee always sits between the two. Member or not comes from the player
database (`membership` other than `none`) and can be switched per player on
the form. Length is the fixture's days (1, or 2 for two or more). Typing a player
offers matching players from the database as tappable suggestions
(`squadSuggestions`); picking one, or typing a name exactly, fills their
handicap and member status (`pickSquadPlayer`), and a known team's squad
pulls each player's current handicap and status the same way. The person
entering pays the whole fee and collects the shares; the entry stores `fee`
({ total, military, days, shares }) and `bookedBy`. Nothing is charged until
card payment is live.

**Events are fixtures too.** A fixture with `event: true` (the organiser's
"This is an event" tick box in the fixture editor) is a party or social, not a
tournament: it carries an Event badge, takes no team entry, and in place of
Register interest members give a name and answer **Going** or **Not going**
(`answerEvent`). In the dev app the Event badge sits beside the Military one. The answers live in the same `fixture-interest` lists with a
`going` flag; one answer per name, so answering again changes it. The card
counts who is going. Same in all three clubs and the demo.

**Fixtures and prices are TPPC's own** (Druids and Vaux keep theirs; the demo
takes TPPC's by resync). `FIXTURES_OFFICIAL` is the 2026 grass list
(`FIXTURES_2026`) followed by the 2026/27 arena list (`FIXTURES_ARENA_2026`).
A fixture may carry a `year`; without one it is 2026 (`fixtureYear`), so a
January or February fixture needs `year: 2027` or a year in its date — the
fixture editor has a Year box. The Fixtures tab groups months into seasons
(`fixtureSeason`: April–September grass, October–March arena) with the season
that is on or coming first. A finished season is archived: members see only
the seasons that are on or to come, and an admin (`captainMode`) finds the rest
under a "Previous seasons" fold at the foot of the list (`showFixtureArchive`);
nothing is deleted, so archived fixtures keep their match details and sign-ups.
Opening the tab scrolls to where the season is now — the fixture on today,
else the next to come, else the last played — landing on its month heading
when it is the month's first (the same in all three clubs). The club's stored list
gets the arena season added **once**, by the `arena-2026-27` entry in
`seed-flags`; a captain's later deletions stay deleted. A new season's list is
added the same way: a new array, a new flag. Prices are the Arena Price List,
Winter 26/27: lessons, tournament entry by category and length (1 or 2 days),
chukka fees £15 a non-member and £10 a military or veteran non-member, and
every membership — the day membership too — including chukka fees. Pony hire
is not on the winter list and is unchanged. `public/tppc-pay.html` is an old,
unlinked payment mock-up and still shows the summer figures.

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
shared key `lesson-slots`). A slot is a **window sold by the hour** — "Rosie
is free 09:00 to 12:00 on the Arena" — offered as individual, group or both.
A booking claims a range inside it and the rest stays open: an individual
lesson owns its hours (`blockedReason`), a group shares its range only with
itself and further riders join it up to `maxGroup`, and a second group cannot
overlap it. So a window of 09:00–12:00 with an individual lesson at 09:00
still offers 10:00 and 11:00, for an hour or two, as either. `slotOptions`
gives the card one entry per type with the free ranges (`combos`) and the
groups that can be joined (`joinable`); the booking sheet has a start and a
length picker for a fresh booking and a fixed range for a join. (It was
"one lesson, booked whole" for a while; the club asked for the hours back.)
The admin sets the group's minimum and maximum; the ground is the same dropdown as chukkas
(`GROUND_OPTIONS`) and caps the group at **6 on the Arena, 8 anywhere else**
(`groundCap`). A group below its minimum is flagged "x of min needed" and the
admin settles it on the card, one box per short group (`shortGroups`): **run
as a smaller group** (`runAsSmallerGroup`, min becomes the count), **make it
individual** (`groupToIndividual`, a group of one, over the same hours, at
the individual rate) or **cancel the group** (`cancelLessonBookings`, in one
write). A member books a lesson or a session for themselves or a teammate
(`teammates`, the same rule as chukkas; `mayBookFor` checks it again at
booking), and sees what they could book plus anything they or their team are
already in; an admin books anyone and sees every slot. A member can book a group lesson for several of their
team at once: the sheet becomes tick boxes (up to the places left), all the
bookings go into the slot in one write, and each player booked is emailed
their own confirmation, which says who booked them. An admin's picker stays a
single dropdown — their list is every player. Captains add or amend lessons, copy last week
forward (times only, never bookings) and book people in by hand.

Each club prices from its **own** rate card, so `LESSON_SLOT_RATES` maps
(kind, hours) → that club's lesson id and lives in each app, not in
`lessons.js`: Druids sells `lesson-1hr` and `semi-private` where TPPC and Vaux
sell `ind-1hr`/`grp-1hr`, and a shared map would quietly bill the wrong lesson.
A length the card does not price is not offered at all. The lesson prices
**include the pony**, as Instructional Chukkas' does, so a club pony adds
nothing to a lesson (`quoteLesson`). The rider still chooses Club pony or My
own pony — it is never chosen for them, and Book stays disabled until one is
picked — because the yard needs to know which to have ready. On the rider's **own pony** a lesson costs the own-pony rate instead:
£45 civilian / £40 military an hour for individual and group lessons, and
£70 / £65 for an Instructional Tournament (`own` on the `LESSON_TYPES_2026`
line; `priceLesson(player, id, ownPony)`). The pony choice shows both prices,
and "Your booking" says the new price when the pony changes.

TPPC also sells its own **club sessions** from the Lessons tab — Ladies Only
and Instructional Chukkas, one hour, two chukkas, eight places. A slot with a
`kind` is a session rather than a lesson: it has its own places and price,
and `normaliseSlot` switches its individual/group flags off so it can never
also be sold as a lesson. Nothing ties a session to
a weekday — the captain adds one on any date and can run several — and Copy
last week carries sessions forward without their riders. The catalogue,
`CLUB_SESSIONS`, lives in the app beside `LESSON_SLOT_RATES` and for the same
reason. Each entry names the chukka day it **is** (`dayKey`), and the price goes
through `priceBooking` with that day, so a session costs exactly what the same
evening costs on the Chukkas tab: Instructional is the rate card's flat
£110/£105 with the pony in it (£45/£40 on the rider's own pony, the line's
`own` price), Ladies Only is the ordinary tariff for two chukkas. No session price is restated anywhere. The day's `maxHandicap` gate
applies too. `CLUB_SESSIONS` must stay
below `DAY_CONFIG`: it reads the start-time constants at load. Druids and Vaux
ship the same `lessons.js` and `LessonsBoard.jsx` but pass no catalogue, and
with none the board is exactly as it was.

**No payment is taken in the app yet.** Payment is moving to a Stripe payment
link; until that is connected a booking is simply accepted, and every booking
screen shows what it will cost (from the rate card), so the price is known up
front. There is no token wallet, no invoice ("due" transaction), no Payments
or Checkout screen and no manual lesson sale — all were removed on the way to
Stripe, and the old `transactions` document is no longer read. When Stripe is
wired in, the booking paths (`handleAdd`, `promoteFromWaitlist`, `homeBook`,
`bookLesson`, `bookClubSession`) are where a payment link is created;
`bookingPrice`, `priceBooking`, `quoteLesson` and `quoteClubSession` give the
amount. Subsidy pots still discount the quoted price but are not drawn down
until payments exist. Tournament entries registered on the Teams tab are kept
in `team-entries` with their fee, unpaid. Note `savePlayer` builds an
**explicit whitelist** — a field not named there is dropped on every save.

Player records also carry what the club's membership spreadsheet holds that
is safe to show: `rank` (military, kept out of `name`, shown in front of it in
the Players list), `memberNo`, `membershipCategory` (the spreadsheet's own
category text, which is finer than `membership`), `hpa` and `arenaIncluded`
(true / false / null for not known). Phone numbers are stored one way —
`07…`, no spaces, no +44 (`ukPhone` in `savePlayer`). The `players` document
is readable without signing in, so date of birth, home address, next of kin
and medical notes are deliberately **not** stored there.

The tab strip is three member tabs — Chukkas, Fixtures, Live Game — plus
**More**, which holds the captain area (Lessons, Players, Teams, Rate card,
Shop). `CAPTAIN_ONLY_TABS` are the tabs a captain alone may sit on, so a
restore or a locked PIN bounces off them; `CAPTAIN_TABS` adds `'more'`, which
a member may open to find the PIN, and is what keeps More lit inside an area.
Add a captain area to both.

On a phone (`max-width: 640px`) the same nav markup is restyled into a fixed
bottom bar with icons — one nav, one state, no second copy to keep in step.
Anything else fixed to the bottom must clear it: `.app-main` and `.app-footer`
carry the padding (the footer is outside `main`), and `.refresh-fab` is lifted,
or it sits on top of the More tab and makes it untappable. Vaux's active tab is
`--cream` where the others are `--gold`.

**Visitor numbers** come from Vercel Web Analytics: `main.jsx` loads
`/_vercel/insights/script.js` on the web only (never in the native app, which
has no Vercel behind it), and the switch is per Vercel project, in the
dashboard under Analytics — the script 404s quietly until it is on. Page
views and visitors, no cookies. A visit from the store app would look like
Safari (the app's web view loads the same site), so `main.jsx` records those
through `va('beforeSend')` under the page `/ios-app` or `/android-app` rather
than `/` — the Pages list in Analytics splits app from browser. (A UTM
source would be tidier, but Vercel sells that breakdown as an add-on; the
page path is in the free plan.) The same lines are in all
four apps, except that the demo has no Capacitor and so no app tag.

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

**A request that starts with `TPPC-DEV` is for the dev app only.** Apply it to
`andyboudier/tppc-dev` (deployed to tppc-dev.poloact.co.uk) and nowhere else —
do not mirror it to TPPC, Druids, Vaux or the demo, and do not touch the live
clubs' repos, Vercel projects or Firebase — unless that same request says
otherwise. The mirroring rule above does not reach into the dev app, and dev
work reaches the live apps only when the owner asks for it to be brought back;
then it is merged into TPPC and mirrored to the others as usual. A request
without the prefix follows the normal rules.

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

**Dev-only so far: sign-in is live, and the app opens on Home.**

TPPC-Dev runs with sign-in **on**, set by the deployment rather than the code:
`VITE_SIGN_IN_LIVE=1` and `VITE_FIXED_ADMIN_EMAILS` (Andy's club address) are
environment variables on the `tppc-dev` Vercel project, read by
`authFirebase.js`. A build that sets neither — every club's — stays dormant, so
the file is the same in both repos. With it on, `main.jsx` wakes the provider
on the first paint, and the app runs the demo's model: admins (the fixed list
plus `config/admins`, which an admin edits in Players → Admins) are
`captainMode` and run everything; the captain PIN is `canScore` and opens live
scoring only; More tells a signed-in member the admin area is for admins and
offers the scoring PIN. Google, Apple and email/password are switched on in the
tppc-dev Firebase console. `captainMode` reads `signInBuild` (sign-in enabled,
or `VITE_SIGN_IN_LIVE` set), not just `auth.enabled`: the provider is only
installed once the auth chunk has loaded, and until then `auth.enabled` is
false — which, with the PIN unlocked, used to hand a member the admin side for
the first seconds of every load (every player in a lesson's "Who is it for").

**Home** (`HomeDashboard.jsx`, model in `home.js`) is first in the bar and is
the sign-in screen: signed out, the bar is Home, Fixtures, Live and More;
Chukkas and Lessons join it once somebody is signed in or `captainMode` is on
(`MEMBER_TABS`, `loggedOn`), and a restore onto either while signed out goes to
Home. The badge is `public/tppc-crest.png`, the official crest cut round from
`icon-512.png`. Signed in, Home greets the member with their handicap and **All bookings** —
two tiles, chukkas and lessons (Ladies Only and Instructional count as lessons,
being booked there), each opening where those bookings live — shows their next chukka (team and chukka numbers
once the draw is published) and the next three fixtures, and offers **Book a
chukka** — two taps, listing only chukka days that person can book (open, or
full with a waiting list; never Ladies Only or Instructional, which are booked
in Lessons), the next open one preselected, with the rest of the Chukkas
form beside it — Available from / to (the same member choices: start up to
three chukkas in, leave from the fifth) and No consecutive chukkas, which is
remembered with the usual chukkas and pony with what they booked
last time, remembered on the phone — and **Book a lesson or instructional
chukka** (`lessonButton`; plain "Book a lesson" for a club with no
instructional session), which opens Lessons on **Everything**, landing on the
next thing that can still be booked — a window with hours free or an
instructional session with places (`openLessonsNext`). Booking goes through the same roster, waiting list and `raiseDue`
(split out of `chargeForBooking`) as the Chukkas form, priced by
`priceBooking`, and Undo takes the entry and its unpaid charge off again.
Lessons is a member tab now (out of `CAPTAIN_ONLY_TABS`): a member gets the
same `LessonsBoard` with the captain's tools off, booking as their own record;
an admin gets the diary and the sign-in bench as before. Home's own AuthSheet
is handed `enabled: true` like the bench, so it works whichever way the switch
is set; `tppc-signed-in` in localStorage tells a later load to wake sign-in
early. An admin sees the next session's list, waiting lists and lessons above their own card.

**Enter a tournament** sits under Book a lesson on Home and walks a member
through a team entry in three steps (`TournamentSheet` in HomeDashboard.jsx,
`homeTour` in PoloChukkas.jsx): pick the tournament, name the team and its
players, then review the fee and confirm. It is the Fixtures tab's own team
entry — the entry lands in `team-signups` with its `fee` and `bookedBy`, the
team is remembered in `teams-db`, and pricing is `priceTeamEntry` — so the
team shows under Teams Entered and on the captain's draw like any other. One
squad plays every day unless a half seat says otherwise (see Tournament seats; a captain can still set per-day squads on Fixtures).
Listed are fixtures that have not finished, are not events, and whose entries
are still open — they close the night before the first day, as Register
interest does — so a party or a course left untagged appears there until the
organiser ticks "This is an event". The member is player 1; names are offered
from the player database with their handicap and membership, a team they have
played in brings its squad back, and the team handicap is the players' sum.
No payment is taken yet: the review shows the total and each player's share
and says it is payable by card once online payment is live; that confirm is
where a Stripe link would go. Undo withdraws the entry.

**Your tournaments** on Home lists the member's own entries still to be
played (`homeTour.mine`: every team they are in, or entered for someone else)
with a Tournaments tile beside Chukkas and Lessons. **Edit team** opens the
same sheet on the team step (`edit` prop): rename, add or remove players,
change the mobile, then Save changes goes through `homeTour.update`, which
keeps the entry's id (the draw points at it) and who booked it, re-prices the
fee from the new squad and collapses a captain-set per-day squad into one.
Withdraw is on that sheet, two taps. All of it until the first day starts;
after that the card is read-only and says the captain makes changes. Home is drawn dark in the club's colours
(`.polo-app.home-on`); the working tabs are unchanged.

**The whole app wears Home's look** (`luxTheme.js`, the `lux` class on
.polo-app). It is an overlay on the existing colour variables rather than a
rewrite: the variables get dark values, and the two that cannot flip —
`--cream` (page colour *and* text on burgundy buttons) and `--burgundy` (fill
*and* text/border colour) — are handled by setting the page ground directly
and re-pointing burgundy text and borders at gold through attribute selectors
on the inline style (`[style*="; color: var(--burgundy)"]`, and the rgb() the
browser writes for inline hex). Inline white panels, ink fills and native
controls are caught the same way. The exported draw table keeps its paper
look. Take the class off and the app is exactly as it was.

**The club's identity is one block, `TERMS_CLUB` in `terms.js`** — name,
short name, place, `slug`, crest (and whether it is set in a white round), the
app's own `burgundy`, and the dark palette (`colors`). `HomeDashboard.jsx`,
`luxTheme.js`, `AuthActionPage.jsx`, `TermsSheet.jsx` and `home.js` all read
it and name no club, so those files are the same in every app and only
`terms.js` differs; the `.hd` variables, the `lux` overlay's variables and the
inline-burgundy selector are all built from it. `slug` prefixes the device
keys (`tppc-signed-in`, `tppc-home-usual`) and the calendar files. The
`RateCardEditor.jsx` is shared the same way, with the card's shape passed in
as props (see the TPPC notes). Druids' and Vaux's `terms.js` carry their own
block, so the Home and the dark theme come out in their colours.

**Profile pictures.** The sign-in's photo (Google gives one; Apple and email do
not) shows on Home by default. A member can set their own — shrunk in the
browser to a 256px JPEG and kept on their own `users/{uid}` profile as
`photo` — or remove it (`'none'`, initials). `savePhoto` is separate from
`saveProfile` so it never moves `updated`, which the profile ↔ record
reconcile compares. The photo is private to the member: it lives on their own
profile, not the shared player list.

**Booking a teammate from Home.** The booking sheet has "Who's playing": the
member and anyone sharing their team (`teammates`, the same rule the Chukkas
form uses). Each person's sessions are worked out for them (booked, beginners
only), the price shown is theirs, and the entry
carries `playerId` and `bookedBy`, as the form's do.

With sign-in live the captain's sign-in bench on Lessons is hidden — Home is
the way in.

**Your profile** (Home → Your profile) is Home's own sheet, not AuthSheet:
picture, name, handicap, HPA number and mobile (saved with `saveProfile`, so
the reconcile carries them to the club's record), the email read-only (it is
what the match runs on), a password — `changePassword` updates it, or adds one
to a Google or Apple account with `linkWithCredential` — and Add Google/Apple.
AuthSheet is only the way in now: opening it at 'profile' for someone already
signed in closed itself straight away (its two opening effects race).

**Reminder emails** (`api/_reminders.js`, run by Vercel Cron from
`vercel.json`): the evening before at 17:00 UTC (`reminders-evening`) and the
morning of at 07:00 UTC (`reminders-morning`) — 18:00 and 08:00 in summer, an
hour earlier in winter, and Vercel may run a daily job any time in that hour.
One email per person listing their chukkas (session, time, ground, chukkas,
pony, and their chukkas and shirt once the draw is published) and lessons.
It reads `shared/<key>` over the Firestore REST API like the Watch apps, and
counts a chukka roster only when `roster-week` is stamped for that very date.
What is the club's own — the day table (it mirrors DAY_CONFIG; keep the two
in step), how the day keys are suffixed, the Firebase project, the app's
address, and the email crest — is `api/_club.js`, which also imports
`TERMS_CLUB` from `src/terms.js` for the name, place and colours. The two
email files name no club and are the same in every app. Safe by
default: it emails only `REMINDERS_ALLOW` (Andy's address on dev) unless
`REMINDERS_LIVE=1`, refuses any call without `CRON_SECRET`, and sends through
Resend with `RESEND_API_KEY`. The two secrets are the owner's to set in Vercel;
`?dry=1` and `?date=YYYY-MM-DD` help a manual test.

**Booking emails** — "you're booked", "booking updated", "booking cancelled"
for chukkas, waiting lists, lessons and club sessions (`api/_bookingEmail.js`,
endpoint `api/booking-email.js`). The app calls `bookingEmail()`
(`src/bookingEmail.js`) after it has saved the change — Home's booking, the
Chukkas form, joining and promotion off the waiting list, the × on a roster
or waiting-list entry, lesson and session booking, every lesson cancellation,
and "Your booking". The request names the booking and nothing more; the
server reads the booking and the player's address from `shared/<key>`, so it
can only tell a member about their own booking. The caller's Firebase ID token
(`auth.idToken()`) is checked with Google (`accounts:lookup`); they may send
for themselves, a teammate, whoever they booked, or anyone as an admin.
"booked"/"amended" must be a change made in the last 15 minutes
(`bookedAt`/`at`/`addedAt`, `amendedAt`), and "cancelled" only goes once the
booking really has gone. The same `REMINDERS_ALLOW` / `REMINDERS_LIVE` gate as
the reminders applies. Each email but a cancellation has **Amend or cancel**:
`?manage=chukka:<day>:<entryId>` (or `waitlist:` / `lesson:<slot>:<booking>`)
opens **Your booking** on Home once the member is signed in (`ManageSheet` in
HomeDashboard.jsx; `homeManage`, `manageAmend`, `manageCancel` in
PoloChukkas.jsx). A chukka changes chukkas, pony, times and no-consecutive, and
the member is told the new price when it changes. A lesson changes only its
pony — to move it, cancel and rebook. With sign-in off there is no ID token,
so the clubs' builds send nothing.

**Who sends, and who else hears.** Booking emails go from
`info@tedworthparkpolo.com` (`MAIL` in `api/_club.js`, with Reply-To the same).
Resend only sends from a verified domain, and tedworthparkpolo.com is not yet
verified there (its DNS is at 20i, mail at Microsoft 365), so `sendMail` in
`_reminders.js` retries a refused send from `fallbackFrom`
(hello@poloact.co.uk) with the Reply-To still the club's. Verifying the domain
in Resend makes the fallback unused; nothing else changes. **Every** booking,
amendment and cancellation — chukkas, waiting lists, lessons, sessions,
tournament entries — is also sent to the office, `NOTIFY` in `_club.js`
(info@, helen@, bradley@tedworthparkpolo.com; `NOTIFY_EMAILS` in Vercel
overrides). The office copy is not held back by `REMINDERS_ALLOW`, which still
gates the member's own email.

**Push notifications (web only).** `src/push.js` subscribes a browser (Home's
footer: "Turn on notifications") and keeps the subscription in the shared doc
`push-subs` with the account's uid and email; `public/sw.js` shows them.
`api/_push.js` sends to the admins on every booking event and to a member
booked in from a waiting list; who is an admin is decided on the server, never
from the subscription. It needs `VITE_VAPID_PUBLIC_KEY`, `VAPID_PUBLIC_KEY`,
`VAPID_SUBJECT` and the sensitive `VAPID_PRIVATE_KEY` on the Vercel project;
without the private key nothing is sent. On an iPhone it works only from the
Home Screen web app. The store apps would need APNs/FCM, which is not wired.

**Lesson waiting lists.** A full club session (Ladies, Instructional) or a
coaching window with no length left offers **Join the waiting list**
(`addWaiting` in `lessons.js`; entries on `slot.waiting`). Members see only how
many are waiting and their own place; admins see the names, in order, with ×.
Cancelling a booking runs `promoteWaiting`, which books the first entry that
now fits (a session place, or a lesson of the length they asked for, joining a
group of that length first) with `promotedAt`, and the member gets "A place
came up — you're booked" by email and push. Copy last week clears waiting
lists. Home's **Your lessons** lists the member's and their teammates' future
lessons and waiting places, with Cancel / Leave the waiting list.

**Tournament seats.** Each player on an entry is a full seat, a half seat or a
reserve. Two half seats share a place: on a two-day tournament, the chukkas on
both days (`both`), the chukkas on one day (`d0s`/`d1s`), or a day each
(`d0`/`d1`, "Day 1 only · plays it all"). A half seat appears only on its days'
squads (`homeDaysFor`), so such an entry is saved `perDay`. Fees split by seat
weight (full 1, half ½, reserve 0); the team handicap leaves reserves out and
counts a half seat once, at the higher. Squads carry `half`, `halfWhen` and
`reserve`; `teams-db` keeps the players without the day detail.

**Own-pony prices** (`own` on a lesson line, Arena Price List): individual
£45 / £65 and group £40 / £55 for one / two hours, Instructional Chukkas £45,
Instructional Tournament £70; the military price of each is £5 less, through
the same flat discount as the club-pony price. The session sheet offers the
pony choice whenever the two prices differ.

**Ladies Only pony** is a flat £110 a session (`ladies-pony` on the rate card,
`ponySessionRate` on DAY_CONFIG.thu), as Instructional's is, plus the chukka
fees for a non-member; the military £5 comes off the pony.

**Fixtures sort by date within their month** (`fixtureMonths`), so an ad hoc
fixture added later lands in its place rather than at the bottom. The live
clubs still append; bringing this back fixes it there too.

**Privacy notice, terms and the public pages.** `privacy.js` is the club's
privacy notice, shaped like `terms.js` (sections of lines, "• " for a
bullet) and built from one `PRIVACY_CLUB` block, so the file is the same in
every club but that block. `TermsSheet` shows either (`doc="privacy"`), and
`?privacy=1` opens it like `?terms=1`; the old hand-written privacy pop-up is
gone. `scripts/legal-pages.mjs` runs before Vite on every `npm run build` and
writes `public/privacy.html`, `public/terms.html` and
`public/delete-account.html` from the same two files — plain HTML with no
script, because the App Store and Google Play listings need a privacy-policy
address and Google Play an account-deletion one. Edit the `.js`, never the
`.html`. Both documents carry a draft notice and [square-bracket] points
until the committee signs them off.

**Yearly records clean-up** (`api/_cleanup.js`, Vercel Cron `cleanup-yearly`,
1 November). Firestore has no TTL policies and the project is on the Spark
plan with no backups, so nothing is ever deleted unless something deletes
it. The privacy notice's periods (`PRIVACY_CLUB.retention`: bookings 2
years, player records 2 years after last play, accounts 3) are kept by this
job: it removes lesson windows and sessions more than two years old, waiting
places on sessions already held, tournament entries for fixtures over two
years ago, and fixture interest once the season is over (or the fixture is
gone). Player records and accounts it only **lists**, by email to the office
(`NOTIFY`), because the club may know a member is coming back and an account
can only be deleted with admin rights (Firebase console → Authentication).
The dev copy emails its `REMINDERS_ALLOW` list instead. `?dry=1` with the
cron secret reports without changing anything; `plan()` is pure and tested.
It writes with the web API key like the app does — tightened Firestore
rules would need a service account. The in-app roster snapshots
(`roster-backups`, 50 kept) and `fixture-details-backups` live in the same
database and are not a backup of it.

**Payment wording waits for Stripe.** The terms say the club **invoices**
(3.4, 23 October 2026 text), because no card payment is taken yet. When the
Stripe link goes live, change 3.4, 4.2, 11.1 and the summary's payment line
back to card payment — the wording to use is in the comment at the top of
`terms.js` — and bump `TERMS_VERSION` so members accept again. The terms'
other decisions: 24 hours' notice to cancel free, no charge for a late
cancellation whose place is filled, a full refund when the club cancels, the
contract is with Tedworth Park Polo Club, and Polo Biz Ltd (pony hire,
contracted by the club) is given the names of riders on club ponies.

**Delete my account** (Home → Your profile, at the foot) is required by both
stores in any app where people can create an account.
`window.auth.deleteAccount({ password, before })` confirms who it is first —
the password, or Google or Apple again (Firebase deletes only a fresh
sign-in) — then runs `before(uid)`, revokes Apple's token (Apple requires it
on deletion), deletes `users/{uid}` and the sign-in. `before` is the app's
`beforeAccountDelete`: it unlinks the club's player record (uid,
authProviders, linkedBy go; the record is the club's and stays) and drops the
account's `push-subs` entries. Where confirming needs a redirect (the Home
Screen web app), the provider sets `pendingDelete` on the way back and the
app finishes it. An account that can only confirm with Google or Apple in a
copy of the app that cannot offer them is told to use the website or email
the club.

**Sign-in inside the store apps.** The iOS and Android apps are this site in
a web view. Google refuses to sign in from a web view, and Apple expects its
own sheet, so `authFirebase.js` uses the native plugin
(`@capacitor-firebase/authentication`, `skipNativeAuth`) when the app has it
and hands its credential to the web SDK with `signInWithCredential` — the
same Firebase account either way. The site changes on deploy but a store app
only on update, so `methodsHere` offers an app without the plugin email and
password only (an emailed link opens in the phone's browser, not the app);
with it, Google and password on Android and Google, Apple and password on
iOS. Home's sign-in text and Your profile's Add Google / Add Apple follow
`auth.methods`. The native half — the plugin in the iOS and Android builds,
the Firebase config files, the Sign in with Apple capability — is separate
and needs the owner's console steps; see that PR.

**The iOS app uses the scene lifecycle.** iOS 27 stops, at launch, any app
built with its SDK that has not adopted UIScene. `ios/App/App/SceneDelegate.swift`
and `UIApplicationSceneManifest` in `Info.plist` (which names it and
`Main.storyboard`) are that adoption; the scene's URL and user-activity events
go through Capacitor's `SceneDelegateProxy`, which hands them to plugins as the
AppDelegate's did. Store builds made before it (1.0.15) still run, being built
with the older SDK; every build from Xcode 27 on needs it.

**Links from emails open in the app.** A password reset, an address to
confirm or restore, and a sign-in link opened on another device are finished
on the app's own screen (`AuthActionPage.jsx`; `emailAction.js` reads the link
without loading the SDK). For the emails themselves to point at the app, the
tppc-dev Firebase console's action URL (Authentication → Templates → any
template → Edit → Customize action URL) must be
`https://tppc-dev.poloact.co.uk/` — until then the link opens Firebase's page
first. Reset signs the member straight in with the new password.

**Google and Apple under the app's own address.** `vercel.json` proxies
`/__/auth/*` and `/__/firebase/*` to tppc-dev.firebaseapp.com, and
`VITE_FIREBASE_AUTH_DOMAIN` on the tppc-dev Vercel project is
`tppc-dev.poloact.co.uk`, so the sign-in handler lives at the app's own
address. This is what makes Google and Apple work on an iPhone: with the
handler on firebaseapp.com, Safari keeps that site's storage apart from the
app's, so a redirect sign-in (always used by the home-screen app, and the
fallback when a pop-up is blocked) came back with nobody signed in and simply
showed the sign-in screen again — desktop browsers still allowed it, which
hid the fault. `https://tppc-dev.poloact.co.uk/__/auth/handler` is an
authorised redirect URI on the tppc-dev Google OAuth client ("Web client
(auto created by Google Service)") and a return URL on the Apple Services ID
`uk.co.tedworthparkpolo.chukkas.web`, with `tppc-dev.poloact.co.uk` among its
domains and the JavaScript origins. Never switch the auth domain before both
are registered — Google answers redirect_uri_mismatch and Apple "Invalid web
redirect url", on desktop too.

**Bringing sign-in to TPPC live repeats all of this for the club's own
address** (tppc.poloact.co.uk, or whichever host the live app answers on), in
this order: (1) in the live Google Cloud project (tedworth-park-polo), on its
auto-created web OAuth client, add the origin `https://<host>` and the redirect
URI `https://<host>/__/auth/handler`; (2) on the Apple Services ID add `<host>`
to the domains and `https://<host>/__/auth/handler` to the return URLs, and
make sure Apple is set up as a provider in the live Firebase console with that
Services ID; (3) add `<host>` to the live Firebase project's authorised
domains; (4) point the vercel.json rewrites at
`tedworth-park-polo.firebaseapp.com`; (5) only then set the live build's
`authDomain` to `<host>` (the `LIVE` config in firebase.js, or
`VITE_FIREBASE_AUTH_DOMAIN`). Check (1) and (2) before (5) by asking
identitytoolkit `accounts:createAuthUri` for each provider with that handler
as `continueUri` and opening the URI it returns: a mismatch shows at once.
The rewrites and crons in vercel.json name the dev project; bringing them back
to TPPC means pointing them at the club's own.

When this is brought back to TPPC it applies to Druids and Vaux too, but
Druids always suffixes day keys and has no waiting list, each club's day names,
crest and palette differ (the theme's gold and burgundy would need each club's
own), and the clubs keep sign-in dormant unless they ask.

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

**Booking terms** (`terms.js` for the text and `TERMS_VERSION`, `TermsSheet.jsx`
for the screen). The committee's working copy is the shared "TPPC Booking Terms
and Conditions" doc; `terms.js` is that text, kept in step by hand, and still
marked draft (`TERMS_DRAFT`). With sign-in on, a member accepts once — an
unticked box, Continue off until it is ticked — and `auth.acceptTerms` puts
`termsVersion` and `termsAcceptedAt` on their profile (beside the photo,
leaving `updated` alone). `needTerms` waits for `auth.profileReady`, so the
screen never flashes before the profile has loaded, and it comes back
whenever `TERMS_VERSION` changes. The terms are linked under every Book button
(`TermsLine`: Home's sheet, "Your booking", lessons and sessions, the Chukkas
form), from the footer beside Privacy, and from every booking email
(`?terms=1` opens them). The app does not yet keep a charge for a late
cancellation; clause 4.2–4.3 waits on the committee's notice period.

**The rate card is editable** (Admin area → Rate card, `RateCardEditor.jsx`).
The printed constants are only defaults: the admins' changes are one shared
document, `rate-card`, laid over them by id (`mergeRateCard`), and every price
reads `RATES` — set from it on each render — never the constants. Lessons
(one price a line, with the own-pony price, which can be taken away with
`own: null`), non-member chukka fees, pony hire per chukka, the **military
discounts** and tournament entry. Every booking screen shows a change at
once. "Back to the printed card" deletes the document.

**Military is a flat discount, not a second column.** The lesson lines carry
one price (`civ`; the key stays for the saved documents) and a player with
Military ticked gets `milLessonDiscount` (£5) off every lesson, own pony or
club's, and `milInstructionalDiscount` (£5) off an instructional chukka
session, both on the card under Military discounts with the pony-hire one
(`MIL_DISCOUNTS`; the editor takes them as `discounts`, and `tiers` is the
single Price column). `priceLesson` reports `list`, `militaryDiscount` and
`base`; the instructional branch of `priceBooking` does the same. Druids and
Vaux keep their two-tier cards — the editor's `discountKey` form still serves
them.

**Subsidies** (captain pots under Players → Subsidies) carry a discount per
lesson and, since the arena season, a discount per **instructional chukka
session** (`discountPerInstructional`, `subsidyInstructional`); either may be
0 but not both. Both are capped at what the pot has left and come off after
the military discount, on `priceLesson` and on the instructional branch of
`priceBooking`. Pots are not drawn down until payments exist.

**Instructional chukkas are for beginners.** Handicap 1 and over is refused
(`DAY_CONFIG.fri.maxHandicap` is 0) and the captain can refuse one player
whatever their handicap with **Not able to book instructional chukkas** on
the player record (`noInstructional`, in the `savePlayer` whitelist).
`instructionalBlockReason` is the one gate, read by `bookClubSession`, by
Home and by the Chukkas form. The tick holds for **everyone, admin
included** — it is the captain's decision about that player, and the way to
book them is to untick it; only the handicap gate is one an admin can book
past, as on the Chukkas form. Memberships gained **RNPA (incl chukkas)**, a military one.

**The Chukkas tab shows Wednesday, Saturday and Sunday** (`CHUKKA_TAB_DAYS`:
the day menu, the default day and the restore guard). Thursday and Friday
stay in `DAY_KEYS` because Ladies Only and Instructional are priced and
stored by those days; they are booked from Lessons, where the filter chips
are **Everything, Lessons** and one per club session (`CLUB_SESSIONS`), and a
chip is also a jump to the next of that kind that can still be booked
(`jumpTo`). A club with no sessions sees no chips. Home's `openDay` for a
session day hands Lessons `focus.filter` so it lands on that kind.
