// Coaching lessons: the windows an admin puts on, and who books them.
//
// A slot is a WINDOW — "the coach is free 09:00–12:00" — sold by the hour.
// The admin says what it may be booked as: individual lessons, group lessons
// (with their own minimum and maximum), or either. A booking claims a range
// inside it, and the rest of the window stays open:
//
//   individual  one rider has the coach for those hours; nobody else can
//               book across them.
//   group       riders join the same range until the maximum; a second group
//               cannot overlap it (one coach, one string of ponies). Below
//               the minimum it still takes bookings and shows "needs N more",
//               and the admin decides — cancel it, make it an individual
//               lesson (with one rider), or run it as a smaller group.
//
// So 09:00–12:00 with an individual lesson at 09:00 still offers 10:00 and
// 11:00, for an hour or two, as individual or group.
//
// Everything here is pure: no storage, no React, no money. Pricing stays in
// the app, because each club has its own rate card — Druids sells a
// semi-private lesson where TPPC sells a group one, and neither uses the
// other's ids. The app passes its card in as `rates`
// ({ individual: { 1: '<id>', 2: '<id>' }, group: {…} }), and a type is only
// offered for a slot whose length that card prices.

export const MIN_GROUP = 4;      // the brief's "minimum 4 people"
export const MAX_GROUP = 6;      // default cap; a slot may override it
export const MAX_HOURS = 4;      // longest single booking we will offer

// The most riders a ground takes: the arena is smaller, so six there and
// eight anywhere else — the same numbers the chukka days cap at.
export const ARENA_MAX = 6;
export const FIELD_MAX = 8;
export const groundCap = (ground) => (String(ground || '').trim().toLowerCase().includes('arena') ? ARENA_MAX : FIELD_MAX);

// ── Times ───────────────────────────────────────────────────────────────────

export const parseHM = (s) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(s || '').trim());
  if (!m) return null;
  const h = Number(m[1]), min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
};

export const fmtHM = (mins) => {
  const m = ((Math.round(Number(mins) || 0) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};

// "13:00–15:00" for display; an en dash, as the rest of the app uses.
export const rangeLabel = (start, hours) => `${start}–${fmtHM(parseHM(start) + hours * 60)}`;

// ── Dates ───────────────────────────────────────────────────────────────────
// Plain YYYY-MM-DD strings, compared lexically. Built in local time so a
// late-evening edit cannot land on yesterday.

export const isoOf = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const parseISO = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || '').trim());
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  d.setHours(0, 0, 0, 0);
  return isoOf(d) === s ? d : null;   // rejects 2026-02-31 and friends
};

export const addDays = (iso, n) => {
  const d = parseISO(iso);
  if (!d) return iso;
  d.setDate(d.getDate() + n);
  return isoOf(d);
};

// The Monday on or before a date — the anchor for "copy last week".
export const mondayOf = (iso) => {
  const d = parseISO(iso);
  if (!d) return iso;
  const back = (d.getDay() + 6) % 7;   // Sun=0 -> 6, Mon=1 -> 0
  d.setDate(d.getDate() - back);
  return isoOf(d);
};

export const dayLabel = (iso) => {
  const d = parseISO(iso);
  return d ? d.toLocaleDateString('en-GB', { weekday: 'short' }) : '';
};

export const dateLabel = (iso) => {
  const d = parseISO(iso);
  return d ? d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : iso;
};

// ── Slots ───────────────────────────────────────────────────────────────────

export const blankSlot = (date) => ({
  id: '',
  date: date || '',
  start: '10:00',
  end: '11:00',
  coach: '',
  ground: '',
  // Empty means a coaching window, sold by the hour. A kind makes this a
  // club session instead — see "Club sessions" below.
  kind: '',
  individual: true,
  group: true,
  minGroup: MIN_GROUP,
  maxGroup: MAX_GROUP,
  note: '',
  bookings: [],
});

export const newSlotId = () => `ls-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
export const newBookingId = () => `lb-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

// Whole hours in the window, or 0 if the times are nonsense or inverted.
export const windowHours = (slot) => {
  const a = parseHM(slot && slot.start), b = parseHM(slot && slot.end);
  if (a === null || b === null || b <= a) return 0;
  return Math.floor((b - a) / 60);
};

// Drop anything malformed rather than letting it reach the UI, and fill in
// defaults for slots written by an older version.
export const normaliseSlot = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  const date = parseISO(raw.date) ? String(raw.date) : null;
  if (!date) return null;
  const slot = {
    ...blankSlot(date),
    ...raw,
    id: String(raw.id || '') || newSlotId(),
    date,
    start: fmtHM(parseHM(raw.start) ?? 600),
    end: fmtHM(parseHM(raw.end) ?? 720),
    kind: String(raw.kind || '').trim(),
    // A club session is one block at one price with its own places, so it is
    // never also offered as an individual or group lesson — otherwise the
    // same evening could be sold twice.
    individual: !String(raw.kind || '').trim() && raw.individual !== false,
    group: !String(raw.kind || '').trim() && raw.group !== false,
    minGroup: Math.max(1, Number(raw.minGroup) || MIN_GROUP),
    maxGroup: Math.max(1, Number(raw.maxGroup) || MAX_GROUP),
    bookings: Array.isArray(raw.bookings) ? raw.bookings.filter(b => b && b.id && parseHM(b.start) !== null) : [],
  };
  return windowHours(slot) > 0 ? slot : null;
};

export const normaliseSlots = (raw) => {
  let arr = raw;
  if (typeof raw === 'string') { try { arr = JSON.parse(raw); } catch (e) { return []; } }
  if (!Array.isArray(arr)) return [];
  return arr.map(normaliseSlot).filter(Boolean).sort(bySlotTime);
};

export const bySlotTime = (a, b) =>
  a.date === b.date ? (parseHM(a.start) - parseHM(b.start)) : (a.date < b.date ? -1 : 1);

// ── What a slot can be booked as ────────────────────────────────────────────

// Kept for callers that list the lengths a card prices.
export const hoursOffered = (rates, type) =>
  Object.keys((rates && rates[type]) || {}).map(Number).filter(n => n > 0).sort((a, b) => a - b);

const lessonBookings = (slot) => (slot.bookings || []).filter(b => b.type === 'individual' || b.type === 'group');

// ── What can be booked in a window ──────────────────────────────────────────
//
// A window is the coach's time, sold by the hour. An individual lesson owns
// its hours outright; a group shares its hours only with itself (one coach,
// one string of ponies); whatever is left of the window stays open to either.
// So a 09:00–12:00 window with an individual lesson at 09:00 still offers
// 10:00–11:00, 11:00–12:00 and 10:00–12:00, as individual or as group.

const spanOf = (start, hours) => {
  const a = parseHM(start);
  return a === null ? null : [a, a + (Number(hours) || 1) * 60];
};
const clash = (aStart, aHours, bStart, bHours) => {
  const a = spanOf(aStart, aHours), b = spanOf(bStart, bHours);
  return !!a && !!b && a[0] < b[1] && b[0] < a[1];
};
export const sameRange = (b, start, hours) => b.start === start && (Number(b.hours) || 1) === Number(hours);

// Every whole-hour sub-range of the window, shortest first at each start —
// a 2-hour window yields 13:00 1hr, 13:00 2hr, 14:00 1hr. `lengths` limits
// it to the lengths the club prices.
export function sessionOptions(slot, lengths) {
  const total = windowHours(slot);
  if (!total || isClubSession(slot)) return [];
  const startMin = parseHM(slot.start);
  const allowed = lengths && lengths.length ? lengths : null;
  const out = [];
  for (let offset = 0; offset < total; offset++) {
    for (let hours = 1; hours <= Math.min(total - offset, MAX_HOURS); hours++) {
      if (allowed && !allowed.includes(hours)) continue;
      const start = fmtHM(startMin + offset * 60);
      out.push({ start, hours, label: rangeLabel(start, hours) });
    }
  }
  return out;
}

// The groups in a slot, one per range, with who is in each.
export const groupBookings = (slot, start, hours) => (slot.bookings || []).filter(b => b.type === 'group'
  && (start == null || sameRange(b, start, hours)));
export const groupRanges = (slot) => {
  const seen = new Map();
  for (const b of groupBookings(slot)) {
    const key = `${b.start} ${Number(b.hours) || 1}`;
    if (!seen.has(key)) seen.set(key, { start: b.start, hours: Number(b.hours) || 1, riders: [] });
    seen.get(key).riders.push(b);
  }
  return [...seen.values()].sort((a, b) => parseHM(a.start) - parseHM(b.start));
};

// Why a range cannot be booked as `type`, or null if it can.
export function blockedReason(slot, start, hours, type, rates) {
  if (isClubSession(slot)) return 'That is a club session, not a lesson.';
  if (type !== 'individual' && type !== 'group') return 'Unknown lesson type.';
  if (type === 'individual' && !slot.individual) return 'Individual lessons are not offered in this slot.';
  if (type === 'group' && !slot.group) return 'Group lessons are not offered in this slot.';
  const h = Number(hours) || 1;
  if (rates && !hoursOffered(rates, type).includes(h)) return `The club has no ${h}-hour ${type} rate.`;
  if (!sessionOptions(slot).some(o => o.start === start && o.hours === h)) return 'That is outside the slot.';
  for (const b of lessonBookings(slot)) {
    const bh = Number(b.hours) || 1;
    if (!clash(start, h, b.start, bh)) continue;
    if (b.type === 'individual') return `Taken — ${b.name || 'someone'} has ${rangeLabel(b.start, bh)}.`;
    if (type === 'individual') return `Taken — a group has ${rangeLabel(b.start, bh)}.`;
    if (!sameRange(b, start, h)) return `A group already has ${rangeLabel(b.start, bh)}.`;
  }
  if (type === 'group' && groupBookings(slot, start, h).length >= Math.max(1, Number(slot.maxGroup) || MAX_GROUP)) return 'That group is full.';
  return null;
}

export const canBook = (slot, start, hours, type, rates) => blockedReason(slot, start, hours, type, rates) === null;

// What the slot offers right now, one entry per type, each with the ranges
// still free (`combos`) and, for a group, the groups already going that can
// be joined. A type with nothing free and nothing to join is not returned.
export function slotOptions(slot, rates) {
  if (isClubSession(slot)) return [];
  const min = Math.max(1, Number(slot.minGroup) || MIN_GROUP);
  const max = Math.max(1, Number(slot.maxGroup) || MAX_GROUP);
  const out = [];
  for (const type of ['individual', 'group']) {
    if (!slot[type]) continue;
    const lengths = rates ? hoursOffered(rates, type) : null;
    const combos = sessionOptions(slot, lengths).filter(o => !blockedReason(slot, o.start, o.hours, type, rates));
    const joinable = type === 'group'
      ? groupRanges(slot).filter(g => g.riders.length < max).map(g => ({
          start: g.start, hours: g.hours, label: rangeLabel(g.start, g.hours), joined: g.riders.length, min, max,
          needs: Math.max(0, min - g.riders.length), spots: Math.max(0, max - g.riders.length),
        }))
      : [];
    // Ranges a group is already in are offered as joins, not as fresh groups.
    const fresh = type === 'group' ? combos.filter(c => !joinable.some(j => j.start === c.start && j.hours === c.hours)) : combos;
    if (!fresh.length && !joinable.length) continue;
    out.push({ type, min, max, combos: fresh, joinable });
  }
  return out;
}

// Groups that have people in them but not yet their minimum — the admin's call.
export const shortGroups = (slot) => groupRanges(slot).filter(g => g.riders.length < Math.max(1, Number(slot.minGroup) || MIN_GROUP));
export const groupShort = (slot) => shortGroups(slot).length > 0;

// The admin's answers to a short group, as new slots (money stays in the app).
//   runSmaller  the minimum comes down to the riders the smallest group has.
export const runAsSmallerGroup = (slot) => {
  const n = Math.min(...shortGroups(slot).map(g => g.riders.length));
  return { ...slot, minGroup: Math.max(1, Number.isFinite(n) ? n : 1) };
};
//   toIndividual  a group of one becomes an individual lesson over the same
//   hours; the slot offers individual from now on, since that is what it is.
export function groupToIndividual(slot) {
  const g = shortGroups(slot).find(x => x.riders.length === 1);
  if (!g) return { ok: false, error: 'Only a group of one can become an individual lesson.', slot };
  const booking = { ...g.riders[0], type: 'individual' };
  return { ok: true, booking, slot: { ...slot, individual: true, bookings: (slot.bookings || []).map(b => (b.id === booking.id ? booking : b)) } };
}

// ── Club sessions ───────────────────────────────────────────────────────────
//
// A coaching lesson is offered as individual or group and becomes whichever
// is booked first. A club session is neither: it is one block of time at one
// price with a set number of places, and you are either in it or you are not.
// Tedworth's Ladies Only and Instructional Chukkas evenings are that shape —
// an hour, two chukkas, up to eight riders — priced from the chukka tariff
// rather than the lesson rate card.
//
// So a slot carries a `kind`, and a kind makes it a session. What the kinds
// ARE — their names, their length, their places and above all their price —
// stays in the app, exactly as the rate card does and for the same reason:
// they are one club's, and a shared list would put another club's name or
// another club's price on somebody's bill. This module only knows that a
// session is booked whole.
//
// Nothing here is tied to a weekday. The captain puts a session on whatever
// date suits and can run more than one, which is the whole point of moving
// them off the fixed day tabs.

export const isClubSession = (slot) => !!String((slot && slot.kind) || '').trim();

export const clubSessionBookings = (slot) => (slot.bookings || []).filter(b => b.type === 'session');

export const clubSessionPlaces = (slot) => Math.max(1, Number(slot && slot.maxGroup) || MAX_GROUP);

export const clubSessionSpots = (slot) => Math.max(0, clubSessionPlaces(slot) - clubSessionBookings(slot).length);

// Runs of spaces are collapsed, not just trimmed: a captain typing somebody in
// by hand twice writes the name a little differently the second time, and
// "Jo  Bloggs" is not a second rider.
const sameRider = (a, b) => {
  if (a.playerId && b.playerId) return String(a.playerId) === String(b.playerId);
  const n = (s) => String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
  return !!n(a.name) && n(a.name) === n(b.name);
};

// Why a rider cannot take a place, or null if they can. A captain booking
// somebody in by hand goes through this too — it is the places that are
// finite, not the way the booking was made.
export function clubSessionBlockedReason(slot, rider) {
  if (!isClubSession(slot)) return 'That is not a club session.';
  // Already booked is checked BEFORE full, or a captain adding somebody who is
  // in fact already in a full session is told to go and find a place for them.
  if (clubSessionBookings(slot).some(b => sameRider(b, rider || {}))) {
    const who = String((rider && rider.name) || '').trim().replace(/\s+/g, ' ');
    return who ? `${who} already has a place.` : 'They already have a place.';
  }
  if (clubSessionSpots(slot) <= 0) return 'That session is full.';
  return null;
}

export function addClubSessionBooking(slot, rider) {
  const reason = clubSessionBlockedReason(slot, rider);
  if (reason) return { ok: false, error: reason, slot };
  // start and hours come from the slot, not the caller: a place is the whole
  // session, and letting them be passed in is how half-sessions would appear.
  const entry = {
    id: newBookingId(), at: Date.now(), ponyHire: false, ...rider,
    type: 'session', kind: slot.kind, start: slot.start, hours: windowHours(slot) || 1,
  };
  return { ok: true, slot: { ...slot, bookings: [...(slot.bookings || []), entry] }, booking: entry };
}

// ── Bookings ────────────────────────────────────────────────────────────────

export function addBooking(slot, booking, rates) {
  const start = booking.start || slot.start;
  const hours = Math.max(1, Number(booking.hours) || 1);
  const reason = blockedReason(slot, start, hours, booking.type, rates);
  if (reason) return { ok: false, error: reason, slot };
  const bh = (b) => Number(b.hours) || 1;
  if (lessonBookings(slot).some(b => b.playerId && b.playerId === booking.playerId && clash(start, hours, b.start, bh(b)))) {
    return { ok: false, error: `${booking.name || 'They'} already ${booking.name ? 'has' : 'have'} a lesson then.`, slot };
  }
  const entry = { id: newBookingId(), at: Date.now(), ponyHire: false, ...booking, start, hours };
  return { ok: true, slot: { ...slot, bookings: [...(slot.bookings || []), entry] }, booking: entry };
}

export const removeBooking = (slot, bookingId) =>
  ({ ...slot, bookings: (slot.bookings || []).filter(b => b.id !== bookingId) });

export const findBooking = (slots, bookingId) => {
  for (const s of slots) {
    const b = (s.bookings || []).find(x => x.id === bookingId);
    if (b) return { slot: s, booking: b };
  }
  return null;
};

// ── The week ────────────────────────────────────────────────────────────────

export const slotsInWeek = (slots, monday) =>
  slots.filter(s => s.date >= monday && s.date < addDays(monday, 7)).sort(bySlotTime);

export const slotsOn = (slots, iso) =>
  slots.filter(s => s.date === iso).sort(bySlotTime);

export const weekDays = (monday) => Array.from({ length: 7 }, (_, i) => addDays(monday, i));

// Copy a week's windows forward, WITHOUT their bookings: the times repeat, the
// people do not. Slots already on the target week are left alone and reported,
// so copying twice does not double the day up.
export function copyWeek(slots, fromMonday, toMonday) {
  const shift = Math.round((parseISO(toMonday) - parseISO(fromMonday)) / 86400000);
  const source = slotsInWeek(slots, fromMonday);
  const existing = slotsInWeek(slots, toMonday);
  const taken = new Set(existing.map(s => `${s.date} ${s.start} ${s.end}`));
  const made = [];
  const skipped = [];
  for (const s of source) {
    const date = addDays(s.date, shift);
    const key = `${date} ${s.start} ${s.end}`;
    if (taken.has(key)) { skipped.push(s); continue; }
    taken.add(key);
    made.push({ ...s, id: newSlotId(), date, bookings: [] });
  }
  return { slots: [...slots, ...made].sort(bySlotTime), made, skipped };
}

// Everything a player has booked, newest window first — for "my lessons".
export function bookingsFor(slots, { playerId, name }) {
  const out = [];
  const n = (s) => String(s || '').trim().toLowerCase();
  for (const s of slots) {
    for (const b of (s.bookings || [])) {
      const mine = (playerId && b.playerId === playerId) || (!b.playerId && name && n(b.name) === n(name));
      if (mine) out.push({ slot: s, booking: b });
    }
  }
  return out.sort((x, y) => bySlotTime(x.slot, y.slot));
}
