// The yearly clean-up: keeps the club's records to the retention periods in
// the privacy notice (src/privacy.js, PRIVACY_CLUB.retention). Firestore
// deletes nothing by itself (no TTL policies), so without this every record
// would stay for ever.
//
// Run by Vercel Cron once a year (vercel.json, 1 November, after the grass
// season), through api/cleanup-yearly.js; refuses any call without
// CRON_SECRET, like the reminders. `?dry=1` reports what it would do and
// changes nothing.
//
// Removed automatically:
//   - lesson windows and club sessions (with their bookings and waiting
//     lists) more than BOOKING_YEARS after their date;
//   - waiting-list entries on sessions that have already happened;
//   - tournament entries (team-signups, team-entries) for fixtures that ended
//     more than BOOKING_YEARS ago;
//   - fixture interest and event answers once that fixture's season is over,
//     and those left behind by a fixture that has been deleted.
// Reported, not removed — a person decides:
//   - player records with no sign of play for PLAYER_YEARS (the club may know
//     a member is coming back), and of those, the ones joined to an account
//     unused for ACCOUNT_YEARS, whose account is deleted in the Firebase
//     console (an account can only be deleted with admin rights).
// The office (NOTIFY in _club.js) gets the report by email.
//
// Writes go through the Firestore REST API with the web API key, as the app's
// own writes do; if the club's Firestore rules are ever tightened so that
// keyed writes are refused, this needs a service account instead.

import { makeReader, projectOf, json, notifyList, sendMail, esc, CLUB } from './_reminders.js';

export const RETENTION = { BOOKING_YEARS: 2, PLAYER_YEARS: 2, ACCOUNT_YEARS: 3 };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const YEAR_MS = 365.25 * 24 * 3600 * 1000;

// A fixture's year and month, as the app works them out (fixtureYear in
// PoloChukkas.jsx): an explicit `year`, else a year in its date, else 2026.
export const fixtureYear = (fx) => {
  const y = Number(fx && fx.year);
  if (y >= 2000 && y < 2100) return y;
  const m = String((fx && fx.date) || '').match(/\b(20\d{2})\b/);
  return m ? parseInt(m[1], 10) : 2026;
};
// The last moment of the fixture's month — good enough for a period counted
// in years, and it never needs the free-text date parsed.
export const fixtureEnd = (fx) => {
  const mi = MONTHS.indexOf(fx && fx.month);
  if (mi < 0) return null;
  return Date.UTC(fixtureYear(fx), mi + 1, 1) - 1;
};
// When the fixture's season is over: grass (April–September) at the end of
// September; arena (October–March) at the end of the following March.
export const seasonEnd = (fx) => {
  const mi = MONTHS.indexOf(fx && fx.month);
  if (mi < 0) return null;
  const y = fixtureYear(fx);
  if (mi >= 3 && mi <= 8) return Date.UTC(y, 9, 1) - 1;
  return mi >= 9 ? Date.UTC(y + 1, 3, 1) - 1 : Date.UTC(y, 3, 1) - 1;
};
const dayEnd = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(iso || '') ? Date.parse(`${iso}T23:59:59Z`) : null);
const norm = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();

// The clean-up itself, on plain data: what to keep, what goes, and the
// players to look at. Pure, so it can be tested without Firestore.
export function plan({ slots = [], fixtures = [], signups = {}, entries = [], interest = {}, players = [], now = Date.now() }) {
  const bookingCut = now - RETENTION.BOOKING_YEARS * YEAR_MS;
  const fxById = new Map(fixtures.map((f) => [f.id, f]));
  const report = { slotsRemoved: 0, waitingCleared: 0, signupsRemoved: 0, entriesRemoved: 0, interestRemoved: 0, players: [], accounts: [] };

  // Lessons and sessions.
  const keptSlots = [];
  slots.forEach((s) => {
    const end = dayEnd(s && s.date);
    if (end != null && end < bookingCut) { report.slotsRemoved += 1; return; }
    if (end != null && end < now && Array.isArray(s.waiting) && s.waiting.length) {
      report.waitingCleared += s.waiting.length;
      keptSlots.push({ ...s, waiting: [] });
      return;
    }
    keptSlots.push(s);
  });

  // Tournament entries from Home and Fixtures (keyed by fixture), and from
  // the Teams tab (a list carrying fixtureId).
  const keptSignups = {};
  Object.entries(signups || {}).forEach(([fid, list]) => {
    const end = fixtureEnd(fxById.get(fid));
    if (end != null && end < bookingCut) { report.signupsRemoved += (list || []).length; return; }
    keptSignups[fid] = list;
  });
  const keptEntries = (entries || []).filter((e) => {
    const end = fixtureEnd(fxById.get(e && e.fixtureId));
    if (end != null && end < bookingCut) { report.entriesRemoved += 1; return false; }
    return true;
  });

  // Interest and event answers: until the end of that season, or straight
  // away when the fixture itself is gone.
  const keptInterest = {};
  Object.entries(interest || {}).forEach(([fid, list]) => {
    const fx = fxById.get(fid);
    const end = fx ? seasonEnd(fx) : -Infinity;
    if (end != null && end < now) { report.interestRemoved += (list || []).length; return; }
    keptInterest[fid] = list;
  });

  // Players: the last sign of play from what is kept — the record's own
  // last change, lessons and sessions by id, tournament squads by name.
  const last = new Map();
  const seen = (id, t) => { if (id != null && t && t > (last.get(id) || 0)) last.set(id, t); };
  const byName = new Map(players.map((p) => [norm(p.name), p.id]));
  players.forEach((p) => seen(p.id, Number(p.updatedAt) || Number(p.createdAt) || 0));
  keptSlots.forEach((s) => (s.bookings || []).forEach((b) => seen(b.playerId != null ? b.playerId : byName.get(norm(b.name)), dayEnd(s.date))));
  Object.entries(keptSignups).forEach(([fid, list]) => {
    const t = fixtureEnd(fxById.get(fid));
    (list || []).forEach((en) => Object.values(en.days || {}).forEach((sq) => (sq || []).forEach((x) => seen(byName.get(norm(x && x.name)), t))));
  });
  players.forEach((p) => {
    const t = last.get(p.id) || 0;
    if (!t) return; // no date at all: never guess about a member
    const years = (now - t) / YEAR_MS;
    if (years >= RETENTION.PLAYER_YEARS) {
      const row = { id: p.id, name: p.name || '', lastSeen: new Date(t).toISOString().slice(0, 10), account: !!p.uid };
      report.players.push(row);
      if (p.uid && years >= RETENTION.ACCOUNT_YEARS) report.accounts.push(row);
    }
  });

  return { slots: keptSlots, signups: keptSignups, entries: keptEntries, interest: keptInterest, report };
}

const makeWriter = (env, fetchImpl = fetch) => {
  const { projectId, apiKey } = projectOf(env);
  return async (key, value) => {
    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/shared/${encodeURIComponent(key)}?updateMask.fieldPaths=value${apiKey ? `&key=${apiKey}` : ''}`;
    const r = await fetchImpl(url, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ fields: { value: { stringValue: JSON.stringify(value) } } }) });
    if (!r.ok) throw new Error(`Writing ${key} failed: ${r.status}`);
  };
};

export function renderReport(r, dry) {
  const lines = [
    `Lesson and session slots removed (older than ${RETENTION.BOOKING_YEARS} years): ${r.slotsRemoved}`,
    `Waiting-list entries cleared from sessions already held: ${r.waitingCleared}`,
    `Tournament entries removed (older than ${RETENTION.BOOKING_YEARS} years): ${r.signupsRemoved + r.entriesRemoved}`,
    `Fixture interest and event answers removed (season over): ${r.interestRemoved}`,
  ];
  const rows = (list) => list.map((p) => `${p.name} (last seen ${p.lastSeen}${p.account ? ', has an account' : ''})`);
  const text = [
    `${CLUB.name}: yearly records clean-up${dry ? ' (dry run, nothing changed)' : ''}`, '',
    ...lines, '',
    `Player records with no play for ${RETENTION.PLAYER_YEARS} years or more, to review and remove in Players unless they are coming back: ${r.players.length}`,
    ...rows(r.players), '',
    `Of those, sign-in accounts unused for ${RETENTION.ACCOUNT_YEARS} years, to delete in the Firebase console (Authentication → Users): ${r.accounts.length}`,
    ...rows(r.accounts),
  ].join('\n');
  const html = `<div style="font-family:system-ui,Arial,sans-serif;font-size:15px;line-height:1.5">${esc(text).replace(/\n/g, '<br>')}</div>`;
  return { subject: `${CLUB.short || CLUB.name}: yearly records clean-up${dry ? ' (dry run)' : ''}`, text, html };
}

export async function runCleanup({ env, now = Date.now(), dry = false, fetchImpl = fetch }) {
  const read = makeReader(env, fetchImpl);
  const data = {
    slots: json(await read('lesson-slots'), []),
    fixtures: json(await read('fixtures'), []),
    signups: json(await read('team-signups'), {}),
    entries: json(await read('team-entries'), []),
    interest: json(await read('fixture-interest'), {}),
    players: json(await read('players'), []),
    now,
  };
  const out = plan(data);
  const r = out.report;
  if (!dry) {
    const write = makeWriter(env, fetchImpl);
    if (r.slotsRemoved || r.waitingCleared) await write('lesson-slots', out.slots);
    if (r.signupsRemoved) await write('team-signups', out.signups);
    if (r.entriesRemoved) await write('team-entries', out.entries);
    if (r.interestRemoved) await write('fixture-interest', out.interest);
  }
  let emailed = 0;
  // The dev copy reports to its test list, never to the club office.
  const to = env.VITE_APP_ENV === 'dev'
    ? String(env.REMINDERS_ALLOW || '').split(',').map((x) => x.trim()).filter(Boolean)
    : notifyList(env);
  if (!dry && env.RESEND_API_KEY && to.length) {
    const mail = renderReport(r, dry);
    const res = await sendMail(env, fetchImpl, { to, subject: mail.subject, html: mail.html, text: mail.text });
    if (res.ok) emailed = to.length;
  }
  return { dry, ...r, players: r.players.length, accounts: r.accounts.length, emailed };
}

export default async function handler(req, res) {
  const env = process.env;
  const auth = req.headers && (req.headers.authorization || req.headers.Authorization);
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Not allowed.' });
    return;
  }
  try {
    res.status(200).json(await runCleanup({ env, dry: (req.query || {}).dry === '1' }));
  } catch (e) {
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
