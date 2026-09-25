// The Home dashboard's model: who is signed in, what they have booked,
// what they owe, and what is coming up. Pure, so it can be checked directly —
// the component draws it and the app supplies the data it already holds.
//
// Nothing here stores anything new in the club's database. Who the member is
// comes from their sign-in, matched to the club's player list by accountLink.js.

const USUAL_KEY = 'tppc-home-usual';

export const normName = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();

// Is this roster or waiting-list entry the member's? Entries booked from Home
// carry the record's id; older ones, and anything a captain typed, only a name.
export const isMine = (entry, me) => !!(entry && me) && (
  (entry.playerId != null && entry.playerId === me.id) || normName(entry.name) === normName(me.name)
);

// ── Whether to wake the sign-in on load ─────────────────────────────────────
// The auth SDK is not on the cold start (see authFirebase.js). Home needs it —
// it is the sign-in screen — and so does a member who is signed in, whichever
// tab they land on. This flag, set once someone has signed in on this device,
// is how a load that restores to Fixtures still knows to wake it.
const SIGNED_IN_KEY = 'tppc-signed-in';
export const hadSignIn = () => {
  try { return localStorage.getItem(SIGNED_IN_KEY) === '1'; } catch (e) { return false; }
};
export const noteSignIn = (on) => {
  try { if (on) localStorage.setItem(SIGNED_IN_KEY, '1'); else localStorage.removeItem(SIGNED_IN_KEY); } catch (e) { /* asks again */ }
};

// What the member usually books, so the booking sheet opens on it. Kept per
// member on the phone; the first time it is two chukkas on their own pony,
// which is the choice that can never put an unexpected charge on an invoice.
export const readUsual = (playerId) => {
  try {
    const all = JSON.parse(localStorage.getItem(USUAL_KEY) || '{}');
    const u = all && all[playerId];
    if (u && Number(u.chukkas) > 0) return { chukkas: Number(u.chukkas), pony: !!u.pony };
  } catch (e) { /* fall through */ }
  return { chukkas: 2, pony: false };
};
export const writeUsual = (playerId, usual) => {
  try {
    const all = JSON.parse(localStorage.getItem(USUAL_KEY) || '{}') || {};
    all[playerId] = { chukkas: usual.chukkas, pony: !!usual.pony };
    localStorage.setItem(USUAL_KEY, JSON.stringify(all));
  } catch (e) { /* nothing to remember with */ }
};

// ── Words ───────────────────────────────────────────────────────────────────
export const greeting = (d = new Date()) => {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
};
export const firstName = (name) => String(name || '').trim().split(/\s+/)[0] || '';
// "Civ · Full Playing (incl chukkas)" → "Full Playing member". The rate card's
// labels are written for the captain choosing one; Home only says what it is.
export const membershipShort = (label, id) => {
  if (!id || id === 'none') return 'Pays per chukka';
  const core = String(label || '').replace(/^(Civ|Mil)\s*·\s*/, '').replace(/\s*\(.*\)\s*$/, '').trim();
  return /member/i.test(core) ? core : `${core} member`;
};

// ── Money ───────────────────────────────────────────────────────────────────
// What is on the member's invoice and not yet settled. Matched on the record
// id, or on the name for a charge raised before the record existed.
export const owedBy = (transactions, me) => (transactions || [])
  .filter(t => t && t.status === 'due')
  .filter(t => (t.playerId != null ? t.playerId === me.id : normName(t.playerName) === normName(me.name)))
  .reduce((s, t) => s + (Number(t.total) || 0), 0);

// ── The draw ────────────────────────────────────────────────────────────────
// The chukkas a roster entry plays in a draw, with the shirt they wear in each.
// teamA is Blue and teamB White, as everywhere else in the app.
export const mySlots = (schedule, entryId) => {
  if (!schedule || !Array.isArray(schedule.chukkas) || entryId == null) return [];
  const out = [];
  schedule.chukkas.forEach((c) => {
    const inA = (c.teamA || []).some(p => p && p.id === entryId);
    const inB = !inA && (c.teamB || []).some(p => p && p.id === entryId);
    if (inA || inB) out.push({ number: c.number, time: c.time, team: inA ? 'Blue' : 'White' });
  });
  return out;
};

// ── Fixtures ────────────────────────────────────────────────────────────────
// Whether the member is already down for a tournament: registered interest in
// it, or named in a team entered for it.
export const isEntered = (fx, me, interest, teamSignups) => {
  if (!me) return false;
  if ((interest[fx.id] || []).some(p => normName(p.name) === normName(me.name))) return true;
  return (teamSignups[fx.id] || []).some(team => {
    const squads = team && team.days ? Object.values(team.days) : [];
    return squads.some(sq => (sq || []).some(p => p && normName(p.name) === normName(me.name)));
  });
};

// Fixtures that have not finished yet, soonest first. `rangeOf` is the app's
// own date parser, so Home and the Fixtures tab can never disagree on a date.
export const upcomingFixtures = (fixtures, rangeOf, now = new Date(), limit = 3) => (fixtures || [])
  .map(fx => ({ fx, range: rangeOf(fx) }))
  .filter(x => x.range && x.range.end >= now)
  .sort((a, b) => a.range.start - b.range.start)
  .slice(0, limit)
  .map(x => ({ ...x, live: x.range.start <= now }));

// ── Sharing and calendars ───────────────────────────────────────────────────
const pad = (n) => String(n).padStart(2, '0');
const icsStamp = (d) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
const icsText = (s) => String(s || '').replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');

// A one-event calendar file in local time, which is what a phone's calendar
// does with a floating time: the throw-in stays at the throw-in.
export const icsFor = ({ title, start, minutes = 60, location = '', note = '' }) => {
  const end = new Date(start.getTime() + minutes * 60000);
  return [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//TPPC//Chukkas//EN', 'BEGIN:VEVENT',
    `UID:${start.getTime()}-${Math.random().toString(36).slice(2, 8)}@tppc`,
    `DTSTAMP:${icsStamp(new Date())}`,
    `DTSTART:${icsStamp(start)}`, `DTEND:${icsStamp(end)}`,
    `SUMMARY:${icsText(title)}`,
    location ? `LOCATION:${icsText(location)}` : null,
    note ? `DESCRIPTION:${icsText(note)}` : null,
    'END:VEVENT', 'END:VCALENDAR',
  ].filter(Boolean).join('\r\n');
};
