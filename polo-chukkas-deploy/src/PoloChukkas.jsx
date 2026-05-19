import React, { useState, useEffect, useRef } from 'react';

// 2026 Tedworth Park Polo Club grass fixtures
const FIXTURES_2026 = [
  { id: 'apr-3',     month: 'April',     date: 'Fri 3 April',           name: 'Area 14 Pony Club Tournament', level: 'Arena' },
  { id: 'apr-11',    month: 'April',     date: 'Sat 11 April',          name: 'Coaching Begins · Pre-Season Welcome Drinks', level: 'Clubhouse from 16:00' },
  { id: 'apr-18',    month: 'April',     date: 'Sat 18 & Sun 19 April', name: 'Club Chukkas', level: 'Tattoo Ground' },
  { id: 'apr-25',    month: 'April',     date: 'Sat 25 & Sun 26 April', name: 'Club Chukkas', level: 'Tattoo Ground' },

  { id: 'may-2',     month: 'May',       date: 'Sat 2 & Sun 3 May',     name: 'Club Chukkas & Tedworth Park Challenge', level: '' },
  { id: 'may-9',     month: 'May',       date: 'Sat 9 & Sun 10 May',    name: 'The Rabbit Cup', level: '−6 to −2 Goal & −2 to 0 Goal' },
  { id: 'may-16-a',  month: 'May',       date: 'Sat 16 & Sun 17 May',   name: 'Cholderton Cup', level: '0 to 2 Goal' },
  { id: 'may-16-b',  month: 'May',       date: 'Sat 16 & Sun 17 May',   name: 'Grenadier Trophy', level: '−6 to −2 Goal' },
  { id: 'may-23-a',  month: 'May',       date: 'Sat 23 & Sun 24 May',   name: 'Queens Royal Hussars Cup', level: '2 to 4 Goal' },
  { id: 'may-23-b',  month: 'May',       date: 'Sat 23 & Sun 24 May',   name: 'Maddison Cup', level: '−4 to 0 Goal' },
  { id: 'may-25',    month: 'May',       date: 'Mon 25 May',            name: 'Royal Artillery Cup', level: 'Open Military' },
  { id: 'may-30-a',  month: 'May',       date: 'Sat 30 & Sun 31 May',   name: '9th Lancer Trophy', level: '−4 to 0 Goal' },
  { id: 'may-30-b',  month: 'May',       date: 'Sat 30 & Sun 31 May',   name: "Queen's Royal Lancers Trophy", level: '2 to 4 Goal' },

  { id: 'jun-6-a',   month: 'June',      date: 'Sat 6 & Sun 7 June',    name: "Ladies & Gentleman's Weekend", level: '4–8 Goal & −4 to 0 Goal' },
  { id: 'jun-6-b',   month: 'June',      date: 'Sat 6 & Sun 7 June',    name: 'Military Ladies', level: '0 to 4 Goal' },
  { id: 'jun-13',    month: 'June',      date: 'Sat 13 & Sun 14 June',  name: "President's Cup", level: '−2 to 0 Goal' },
  { id: 'jun-17',    month: 'June',      date: 'Wed 17 June',           name: 'Deep Recce Strike Brigade', level: 'Open Military' },
  { id: 'jun-20-a',  month: 'June',      date: 'Sat 20 & Sun 21 June',  name: '10th Hussars Trophy', level: '0 to 2 Goal' },
  { id: 'jun-20-b',  month: 'June',      date: 'Sat 20 & Sun 21 June',  name: 'Dodsworth Family Challenge', level: '−6 to −2 Goal' },
  { id: 'jun-27',    month: 'June',      date: 'Sat 27 & Sun 28 June',  name: 'Manlein Cup', level: '−4 to 0 Goal' },

  { id: 'jul-4-a',   month: 'July',      date: 'Sat 4 & Sun 5 July',    name: 'Douglas Nugent', level: '−4 to 0 Goal' },
  { id: 'jul-4-b',   month: 'July',      date: 'Sat 4 & Sun 5 July',    name: 'Kingsette Cup', level: '0 to 2 Goal' },
  { id: 'jul-11',    month: 'July',      date: 'Sat 11 July',           name: 'Rundle Cup Day', level: 'Military · Army v Navy' },
  { id: 'jul-18-a',  month: 'July',      date: 'Sat 18 & Sun 19 July',  name: 'The Captains & Subalterns Trophy', level: 'Open Military' },
  { id: 'jul-18-b',  month: 'July',      date: 'Sat 18 & Sun 19 July',  name: 'Clitherow Cup', level: 'Away match at New Park' },
  { id: 'jul-24',    month: 'July',      date: 'Fri 24 & Sun 26 July',  name: 'Queens Royal Irish Hussars Trophy', level: '0 to 2 Goal' },
  { id: 'jul-25',    month: 'July',      date: 'Sat 25 July',           name: 'The Duke of York Trophy', level: 'RNPA v RAF' },

  { id: 'aug-1-a',   month: 'August',    date: 'Sat 1 & Sun 2 August',  name: 'KRH Cup', level: '2 to 4 Goal' },
  { id: 'aug-1-b',   month: 'August',    date: 'Sat 1 & Sun 2 August',  name: 'Kadugli Cup', level: '−4 to 0 Goal' },
  { id: 'aug-2',     month: 'August',    date: 'Sun 2 August',          name: 'Tiger Trophy', level: 'RNPA v RAF v Army' },
  { id: 'aug-8',     month: 'August',    date: 'Sat 8 & Sun 9 August',  name: 'Veterans Tournament', level: '−4 to 0 Goal' },
  { id: 'aug-10',    month: 'August',    date: 'Mon 10 August',         name: 'Pony Club Friendly', level: '' },
  { id: 'aug-15-a',  month: 'August',    date: 'Sat 15 & Sun 16 August', name: 'Barnard Trophy', level: '4 Goal VL' },
  { id: 'aug-15-b',  month: 'August',    date: 'Sat 15 & Sun 16 August', name: 'Canada Cup', level: '−4 to 0 Goal' },
  { id: 'aug-22',    month: 'August',    date: 'Sat 22 & Sun 23 August', name: "Polo Captain's Trophy", level: '0 to 2 & −4 to 0 Goal' },
  { id: 'aug-29',    month: 'August',    date: 'Sat 29 & Sun 30 August', name: 'Full Swing Trophy', level: '−6 to −2 Goal' },
  { id: 'aug-31',    month: 'August',    date: 'Mon 31 August',         name: 'AGC Cup', level: 'Open Military' },

  { id: 'sep-5',     month: 'September', date: 'Sat 5 & Sun 6 September',   name: 'Frost Cup', level: '−6 to −2 & −2 to 0 Goal' },
  { id: 'sep-12',    month: 'September', date: 'Sat 12 & Sun 13 September', name: 'Valette Cup', level: '−4 to 0 Goal' },
  { id: 'sep-19',    month: 'September', date: 'Sat 19 & Sun 20 September', name: 'Light Infantry Trophy · Grooms Instructional · End of Season Awards', level: '−4 to 0 Goal' },
];

const MONTHS_ORDER = ['April', 'May', 'June', 'July', 'August', 'September'];
const HANDICAP_OPTIONS = [-2, -1, 0, 1, 2, 3, 4];
const CHUKKA_START_MIN_WED = 17 * 60 + 30;  // 17:30 — Wednesday default
const CHUKKA_START_MIN_THU = 10 * 60;        // 10:00 — Thursday Instructional default
const CHUKKA_START_MIN_SAT = 11 * 60;        // 11:00 — Saturday default
const CHUKKA_START_MIN_SUN = 11 * 60;        // 11:00 — Sunday default
const CHUKKA_INTERVAL_MIN = 15;
const SLOTS_PER_CHUKKA = 8; // 4 v 4
const MIN_PLAYERS_PER_CHUKKA = 4; // target minimum; redistribution will move players to honour this where possible

// Pairs of players who must not share a chukka. Each entry is two name
// patterns (lower-case, space-separated). Matching is prefix-based on each
// word: the last word of the pattern is matched as a prefix of the player's
// corresponding name word — so "william w" matches "William Wood",
// "William Wells", etc. Add more pairs here as needed.
const CONFLICT_PAIRS = [
  ['ed whittington', 'william w'],
];

// Lower-case, single-spaced
const normaliseName = (name) => (name || '').trim().toLowerCase().replace(/\s+/g, ' ');

// Does the player's name match this lowercase pattern?
// Pattern is space-separated words; all but the last must match exactly,
// the last is treated as a prefix. Pattern words must align with the start
// of the player's name (so "ed whittington" matches "Ed Whittington Jr"
// but not "Mr Ed Whittington").
const nameMatchesPattern = (name, pattern) => {
  const nameWords = normaliseName(name).split(' ');
  const patternWords = pattern.split(' ');
  if (nameWords.length < patternWords.length) return false;
  for (let i = 0; i < patternWords.length; i++) {
    const pw = patternWords[i];
    const nw = nameWords[i];
    if (i === patternWords.length - 1) {
      if (!nw.startsWith(pw)) return false;
    } else if (nw !== pw) {
      return false;
    }
  }
  return true;
};

// Returns the list of pattern strings that the given name conflicts with.
// e.g. for "Ed Whittington", returns ['william w'].
const getConflictPatternsFor = (name) => {
  const out = [];
  for (const [a, b] of CONFLICT_PAIRS) {
    if (nameMatchesPattern(name, a)) out.push(b);
    if (nameMatchesPattern(name, b)) out.push(a);
  }
  return out;
};

// True if adding candidate (by name) to a chukka would create a conflict
// with someone already in that chukka.
const chukkaHasConflictWith = (chukkaList, candidateName) => {
  const patterns = getConflictPatternsFor(candidateName);
  if (patterns.length === 0) return false;
  return chukkaList.some(p => patterns.some(pat => nameMatchesPattern(p.name, pat)));
};

// Day configuration. Each day key gets its own roster, schedule, week stamp,
// and configurable throw-in time stored independently in Firestore.
const DAY_CONFIG = {
  wed: { key: 'wed', label: 'Wed',  fullLabel: 'Wednesday',  short: 'Wed', dow: 3, eveningPrev: 'Tuesday',   defaultStartMin: CHUKKA_START_MIN_WED, tabLabel: 'Wed Chukkas' },
  thu: { key: 'thu', label: 'Thu',  fullLabel: 'Thursday',   short: 'Thu', dow: 4, eveningPrev: 'Wednesday', defaultStartMin: CHUKKA_START_MIN_THU, tabLabel: 'Thu Instructional' },
  sat: { key: 'sat', label: 'Sat',  fullLabel: 'Saturday',   short: 'Sat', dow: 6, eveningPrev: 'Friday',    defaultStartMin: CHUKKA_START_MIN_SAT, tabLabel: 'Sat Chukkas' },
  sun: { key: 'sun', label: 'Sun',  fullLabel: 'Sunday',     short: 'Sun', dow: 0, eveningPrev: 'Saturday',  defaultStartMin: CHUKKA_START_MIN_SUN, tabLabel: 'Sun Chukkas' },
};
const DAY_KEYS = ['wed', 'thu', 'sat', 'sun'];

// Format minutes-since-midnight as HH:MM
const fmtTime = (mins) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
};

// Parse HH:MM string back to minutes
const parseTime = (str) => {
  if (!str || typeof str !== 'string') return null;
  const m = str.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h * 60 + min;
};

// Example rosters for testing the app
const EXAMPLES = {
  may20: {
    label: 'Wed 20 May',
    note: '17 players · 8 chukkas',
    roster: [
      { name: 'Rosie Ross',     handicap:  2, chukkas: 5, availableFrom: '17:30', mobile: '07700 900012' },
      { name: 'Ed Whittington', handicap:  1, chukkas: 2, availableFrom: '18:00', mobile: '07700 900401' },
      { name: 'Brad',           handicap:  1, chukkas: 6, availableFrom: '18:15', mobile: '07700 900034' },
      { name: 'Oliver Olsen',   handicap:  1, chukkas: 4, availableFrom: '18:30', mobile: '07700 900412' },
      { name: 'Piers F',        handicap:  0, chukkas: 2, availableFrom: '17:30', mobile: '07700 900334' },
      { name: 'Alex W',         handicap:  0, chukkas: 4, availableFrom: '17:30', mobile: '07700 900245' },
      { name: 'Rosie L',        handicap:  0, chukkas: 6, availableFrom: '17:30', mobile: '07700 900056' },
      { name: 'Steve Collins',  handicap:  0, chukkas: 4, availableFrom: '18:45', mobile: '07700 900423' },
      { name: 'Robert T-R',     handicap: -1, chukkas: 3, availableFrom: '17:30', mobile: '07700 900434' },
      { name: 'Debbie B',       handicap: -1, chukkas: 5, availableFrom: '17:30', mobile: '07700 900091' },
      { name: 'Lizzie W',       handicap: -1, chukkas: 2, availableFrom: '18:00', mobile: '07700 900287' },
      { name: 'Andy B',         handicap: -1, chukkas: 4, availableFrom: '17:30', mobile: '07700 900298' },
      { name: 'Max Morant',     handicap: -1, chukkas: 2, availableFrom: '18:30', mobile: '07700 900445' },
      { name: 'William W',      handicap: -2, chukkas: 2, availableFrom: '18:30', mobile: '07700 900147' },
      { name: 'Alfie',          handicap: -2, chukkas: 2, availableFrom: '17:30', mobile: '07700 900192' },
      { name: 'Helen G',        handicap: -2, chukkas: 2, availableFrom: '18:30', mobile: '07700 900215' },
      { name: 'Steve Wells',    handicap: -2, chukkas: 4, availableFrom: '18:45', mobile: '07700 900168' },
    ],
  },
  may13: {
    label: 'Wed 13 May',
    note: '10 players · 5 chukkas',
    roster: [
      { name: 'Rosie Ross', handicap:  2, chukkas: 4, preference: 'early', mobile: '07700 900012' },
      { name: 'Brad',       handicap:  1, chukkas: 5, preference: 'any',   mobile: '07700 900034' },
      { name: 'Rosie L',    handicap:  0, chukkas: 4, preference: 'early', mobile: '07700 900056' },
      { name: 'Sam Tay',    handicap:  0, chukkas: 3, preference: 'any',   mobile: '07700 900078' },
      { name: 'Debbie B',   handicap: -1, chukkas: 4, preference: 'late',  mobile: '07700 900091' },
      { name: 'Jo Wells',   handicap: -1, chukkas: 4, preference: 'early', mobile: '07700 900103' },
      { name: 'William W',  handicap: -2, chukkas: 4, preference: 'early', mobile: '07700 900147' },
      { name: 'Steve W',    handicap: -2, chukkas: 4, preference: 'early', mobile: '07700 900168' },
      { name: 'Alfie',      handicap: -2, chukkas: 2, preference: 'late',  mobile: '07700 900192' },
      { name: 'Helen',      handicap: -2, chukkas: 2, preference: 'early', mobile: '07700 900215' },
    ],
  },
  may6: {
    label: 'Wed 6 May',
    note: '14 players · 8 chukkas',
    roster: [
      { name: 'Rosie Ross', handicap:  2, chukkas: 6, preference: 'any',   mobile: '07700 900012' },
      { name: 'Stevie',     handicap:  2, chukkas: 4, preference: 'any',   mobile: '07700 900233' },
      { name: 'Brad',       handicap:  1, chukkas: 6, preference: 'any',   mobile: '07700 900034' },
      { name: 'Rosie L',    handicap:  0, chukkas: 6, preference: 'early', mobile: '07700 900056' },
      { name: 'Alex W',     handicap:  0, chukkas: 5, preference: 'any',   mobile: '07700 900245' },
      { name: 'Sam Tay',    handicap:  0, chukkas: 3, preference: 'early', mobile: '07700 900078' },
      { name: 'Lizzie W',   handicap: -1, chukkas: 2, preference: 'any',   mobile: '07700 900287' },
      { name: 'Debbie B',   handicap: -1, chukkas: 4, preference: 'early', mobile: '07700 900091' },
      { name: 'Andy B',     handicap: -1, chukkas: 4, preference: 'any',   mobile: '07700 900298' },
      { name: 'Jo Wells',   handicap: -1, chukkas: 4, preference: 'any',   mobile: '07700 900103' },
      { name: 'William W',  handicap: -2, chukkas: 5, preference: 'any',   mobile: '07700 900147' },
      { name: 'Steve W',    handicap: -2, chukkas: 4, preference: 'late',  mobile: '07700 900168' },
      { name: 'Alfie',      handicap: -2, chukkas: 4, preference: 'late',  mobile: '07700 900192' },
      { name: 'Helen',      handicap: -2, chukkas: 2, preference: 'late',  mobile: '07700 900215' },
    ],
  },
  apr29: {
    label: 'Wed 29 April',
    note: '16 players · 8 chukkas',
    roster: [
      { name: 'Rosie Ross',     handicap:  2, chukkas: 6, preference: 'any',   mobile: '07700 900012' },
      { name: 'Brad',           handicap:  1, chukkas: 5, preference: 'any',   mobile: '07700 900034' },
      { name: 'Jose',           handicap:  1, chukkas: 8, preference: 'any',   mobile: '07700 900321' },
      { name: 'Alex Welham',    handicap:  0, chukkas: 3, preference: 'any',   mobile: '07700 900245' },
      { name: 'Rosie Lawrance', handicap:  0, chukkas: 5, preference: 'any',   mobile: '07700 900056' },
      { name: 'Piers F',        handicap:  0, chukkas: 2, preference: 'early', mobile: '07700 900334' },
      { name: 'Andy B',         handicap: -1, chukkas: 4, preference: 'any',   mobile: '07700 900298' },
      { name: 'Jo W',           handicap: -1, chukkas: 4, preference: 'any',   mobile: '07700 900103' },
      { name: 'Debbie',         handicap: -1, chukkas: 4, preference: 'early', mobile: '07700 900091' },
      { name: 'Alfie',          handicap: -2, chukkas: 2, preference: 'late',  mobile: '07700 900192' },
      { name: 'Helen',          handicap: -2, chukkas: 2, preference: 'any',   mobile: '07700 900215' },
      { name: 'Steve W',        handicap: -2, chukkas: 4, preference: 'late',  mobile: '07700 900168' },
      { name: 'Karen Reeve',    handicap:  0, chukkas: 4, preference: 'early', mobile: '07700 900347' },
      { name: 'Charlie Wilding',handicap: -2, chukkas: 2, preference: 'early', mobile: '07700 900356' },
      { name: 'Milly Till',     handicap: -2, chukkas: 2, preference: 'early', mobile: '07700 900369' },
      { name: 'Gabe Lewis',     handicap: -2, chukkas: 2, preference: 'early', mobile: '07700 900372' },
    ],
  },
};

// Format handicap for display (using proper minus sign for negatives)
const fmtH = (h) => h < 0 ? `−${Math.abs(h)}` : `${h}`;

// Time for chukka index (0-based), given the day's throw-in start time (in minutes since midnight)
const chukkaTime = (idx, startMin) => {
  const total = startMin + idx * CHUKKA_INTERVAL_MIN;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}:${m.toString().padStart(2, '0')}`;
};

// Build a full evening schedule from the roster
function buildSchedule(players, startMin) {
  if (players.length === 0) return null;

  // Process players in the order they appear in the roster array.
  // The captain can reorder the roster to control scheduling priority;
  // earlier in the list = higher priority to receive their requested chukkas.
  const ordered = [...players];

  const totalRequested = ordered.reduce((s, p) => s + p.chukkas, 0);
  // Number of chukkas is purely driven by demand: total slots requested ÷ 8.
  // Floor is 1 (need at least one chukka if anyone signed up).
  const numChukkas = Math.max(1, Math.ceil(totalRequested / SLOTS_PER_CHUKKA));

  // Each chukka has a strict cap of SLOTS_PER_CHUKKA (= 8 = 4 per team)
  const chukkaPlayers = Array.from({ length: numChukkas }, () => []);
  const remainingCapacity = Array(numChukkas).fill(SLOTS_PER_CHUKKA);

  const assignments = new Map();
  const capped = [];   // wanted more chukkas than the evening has at all
  const reduced = [];  // got fewer chukkas than wanted due to capacity

  ordered.forEach(player => {
    const wantedRaw = player.chukkas;

    // Resolve "available from" into a starting chukka index.
    // - availableFrom is a HH:MM string. Default (missing/legacy data) = throw-in time.
    // - availableIdx is the first chukka at or after that time. Players with
    //   availableFrom earlier than throw-in get availableIdx = 0 (treated as
    //   "from throw-in" — e.g. happens when captain pushes the throw-in time
    //   later AFTER a player already signed up).
    let availableIdx = 0;
    if (player.availableFrom) {
      const targetMin = parseTime(player.availableFrom);
      if (targetMin !== null) {
        availableIdx = Math.max(0, Math.ceil((targetMin - startMin) / CHUKKA_INTERVAL_MIN));
      }
    }
    // Resolve "available to" into an upper-bound chukka index (inclusive).
    // - availableTo is a HH:MM string matching the START time of the latest
    //   chukka the player can stay for. Empty / missing = no upper cap.
    // - availableToIdx is clamped strictly to numChukkas - 1; if the player's
    //   window is empty (e.g. availableIdx > availableToIdx) availableCount
    //   falls out as 0 below and the loop simply doesn't place them.
    let availableToIdx = numChukkas - 1;
    if (player.availableTo) {
      const targetMin = parseTime(player.availableTo);
      if (targetMin !== null) {
        const idx = Math.floor((targetMin - startMin) / CHUKKA_INTERVAL_MIN);
        availableToIdx = Math.min(numChukkas - 1, idx);
      }
    }
    const availableCount = Math.max(0, availableToIdx - availableIdx + 1);

    // First cap: by total chukkas in the schedule (existing behaviour)
    const cappedWanted = Math.min(wantedRaw, numChukkas);
    if (cappedWanted < wantedRaw) {
      capped.push({ player, requested: wantedRaw, given: cappedWanted });
    }
    // Second cap: by the chukkas actually available from their start time
    const wanted = Math.min(cappedWanted, availableCount);

    // Place this player into chukkas, starting from their earliest available
    // and going forward up to their availableTo cap (default: end of evening).
    // Respects the 8-per-chukka cap AND the configured conflict pairs (e.g.
    // Ed and William not in the same chukka).
    //
    // Special case for players booking exactly 2 chukkas: try to leave a
    // 1-chukka gap between assignments. This helps when they're using the
    // same pony for both chukkas — gives the pony a rest chukka in between.
    // If the gap pass can't fit all their chukkas (capacity / conflict
    // pressure), a second pass falls back to adjacent slots.
    //
    // Any shortfall (from availability, capacity, conflicts, or gap rules)
    // shows up in `reduced` — captain can review and adjust manually.
    const wantsGap = player.chukkas === 2;
    const minStep = wantsGap ? 2 : 1;
    const myChukkas = [];
    let lastPlaced = -minStep; // sentinel — first placement always succeeds
    for (let c = availableIdx; c <= availableToIdx; c++) {
      if (myChukkas.length >= wanted) break;
      if (c - lastPlaced < minStep) continue;
      if (remainingCapacity[c] <= 0) continue;
      if (chukkaHasConflictWith(chukkaPlayers[c], player.name)) continue;
      myChukkas.push(c);
      lastPlaced = c;
      chukkaPlayers[c].push(player);
      remainingCapacity[c]--;
    }
    // Fallback pass for gap-wanting players: if the gap-preserving pass
    // didn't fit all requested chukkas, allow adjacent slots rather than
    // leaving the player short.
    if (wantsGap && myChukkas.length < wanted) {
      const already = new Set(myChukkas);
      for (let c = availableIdx; c <= availableToIdx; c++) {
        if (myChukkas.length >= wanted) break;
        if (already.has(c)) continue;
        if (remainingCapacity[c] <= 0) continue;
        if (chukkaHasConflictWith(chukkaPlayers[c], player.name)) continue;
        myChukkas.push(c);
        chukkaPlayers[c].push(player);
        remainingCapacity[c]--;
      }
    }

    if (myChukkas.length < cappedWanted) {
      reduced.push({ player, requested: cappedWanted, given: myChukkas.length });
    }

    assignments.set(player.id, myChukkas.sort((a, b) => a - b));
  });

  // Redistribution pass — try to bring every chukka up to at least
  // MIN_PLAYERS_PER_CHUKKA (4) by moving players FROM chukkas that have
  // spare capacity (5+ players) TO ones that don't yet have 4. A player
  // can only move to a chukka they aren't already in, and the move must
  // not introduce a conflict pair. Safety cap on iterations prevents loops.
  let safety = numChukkas * SLOTS_PER_CHUKKA * 2;
  while (safety-- > 0) {
    // Find the most-under-full chukka (fewest players, and below the target)
    let underIdx = -1, underCount = MIN_PLAYERS_PER_CHUKKA;
    for (let i = 0; i < numChukkas; i++) {
      if (chukkaPlayers[i].length < underCount) {
        underIdx = i;
        underCount = chukkaPlayers[i].length;
      }
    }
    if (underIdx === -1) break; // all chukkas have >= 4

    // Find a donor chukka — most-loaded one (>= 5) with a movable player
    let bestSrcIdx = -1, bestPlayer = null, bestSrcCount = MIN_PLAYERS_PER_CHUKKA;
    for (let s = 0; s < numChukkas; s++) {
      if (s === underIdx) continue;
      if (chukkaPlayers[s].length <= MIN_PLAYERS_PER_CHUKKA) continue;
      if (chukkaPlayers[s].length <= bestSrcCount) continue;
      // Find a player in s who could move to underIdx
      const movable = chukkaPlayers[s].find(p =>
        !chukkaPlayers[underIdx].some(q => q.id === p.id) &&
        !chukkaHasConflictWith(chukkaPlayers[underIdx], p.name)
      );
      if (movable) {
        bestSrcIdx = s;
        bestPlayer = movable;
        bestSrcCount = chukkaPlayers[s].length;
      }
    }
    if (bestSrcIdx === -1) break; // can't redistribute further

    // Move
    chukkaPlayers[bestSrcIdx] = chukkaPlayers[bestSrcIdx].filter(p => p.id !== bestPlayer.id);
    chukkaPlayers[underIdx].push(bestPlayer);
  }

  // Build each chukka with balanced teams (max 4 per team naturally, since cap = 8)
  const chukkas = chukkaPlayers.map((inChukka, c) => {
    const sorted = [...inChukka].sort((a, b) => b.handicap - a.handicap);
    const teamA = [], teamB = [];
    let sumA = 0, sumB = 0;
    sorted.forEach(p => {
      if (teamA.length < teamB.length) { teamA.push(p); sumA += p.handicap; }
      else if (teamB.length < teamA.length) { teamB.push(p); sumB += p.handicap; }
      else if (sumA <= sumB) { teamA.push(p); sumA += p.handicap; }
      else { teamB.push(p); sumB += p.handicap; }
    });
    return {
      idx: c,
      number: c + 1,
      time: chukkaTime(c, startMin),
      isEarly: c < numChukkas / 2,
      teamA, teamB, sumA, sumB,
      playerCount: inChukka.length,
    };
  });

  return { chukkas, numChukkas, totalSlots: totalRequested, unplaced: [], capped, reduced };
}

export default function PoloChukkas() {
  // Tabs: 'wed' | 'thu' | 'sat' | 'sun' (chukka days) | 'fixtures'
  const [activeTab, setActiveTab] = useState('wed');

  // Per-day chukkas state — rosters, schedules, throw-in times all keyed by day.
  // Default throw-ins come from DAY_CONFIG; captain can override them per day.
  const [rosters, setRosters] = useState({ wed: [], thu: [], sat: [], sun: [] });
  const [schedules, setSchedules] = useState({ wed: null, thu: null, sat: null, sun: null });
  const [throwInMins, setThrowInMins] = useState({
    wed: DAY_CONFIG.wed.defaultStartMin,
    thu: DAY_CONFIG.thu.defaultStartMin,
    sat: DAY_CONFIG.sat.defaultStartMin,
    sun: DAY_CONFIG.sun.defaultStartMin,
  });

  // Form state (shared across days — the form belongs to whichever day is active)
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [handicap, setHandicap] = useState('');
  const [chukkas, setChukkas] = useState('');
  // Player's earliest available start time (HH:MM string matching one of the
  // first four chukka start times for the active day). Empty string means
  // "available from throw-in" — the default.
  const [availableFrom, setAvailableFrom] = useState('');
  // Player's latest available chukka — HH:MM string matching the START time
  // of the last chukka they can play (INCLUSIVE). Empty string means
  // "available until the end of the evening" — the default.
  const [availableTo, setAvailableTo] = useState('');
  const [error, setError] = useState('');

  // Throw-in time editor (captain mode)
  const [throwInEditing, setThrowInEditing] = useState(false);
  const [throwInInput, setThrowInInput] = useState('');

  // Active day — used to index into the day-keyed state. Defaults to 'wed' when
  // on the fixtures tab so derived values are always defined.
  const activeDay = DAY_KEYS.includes(activeTab) ? activeTab : 'wed';
  const activeDayConfig = DAY_CONFIG[activeDay];

  // Convenience accessors so the existing component code can keep using
  // `players`, `schedule`, etc. without knowing about the day dimension.
  const players = rosters[activeDay];
  const schedule = schedules[activeDay];
  const throwInMin = throwInMins[activeDay];

  // Setters that update only the active day's slice
  const setPlayers = (next) => setRosters(prev => ({
    ...prev,
    [activeDay]: typeof next === 'function' ? next(prev[activeDay]) : next,
  }));
  const setSchedule = (next) => setSchedules(prev => ({
    ...prev,
    [activeDay]: typeof next === 'function' ? next(prev[activeDay]) : next,
  }));

  // WhatsApp group settings
  const [waLink, setWaLink] = useState('');
  const [waEditing, setWaEditing] = useState(false);
  const [waInput, setWaInput] = useState('');

  // Members directory — remembers handicap/mobile/availability per name across weeks
  const [members, setMembers] = useState({});

  // Fixtures state
  const [interest, setInterest] = useState({}); // { [fixtureId]: [{ id, name, handicap, mobile?, email? }] }
  const [expandedId, setExpandedId] = useState(null);
  const [fName, setFName] = useState('');
  const [fHandicap, setFHandicap] = useState('');
  const [fMobile, setFMobile] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fError, setFError] = useState('');

  // Manual schedule editing
  const [activePlayer, setActivePlayer] = useState(null); // { chukkaIdx, playerId } | null
  const [addingTo, setAddingTo] = useState(null);          // chukkaIdx where "+ Add" picker is open
  const [editingAvailId, setEditingAvailId] = useState(null); // player id whose avail window is being edited
  const [scheduleView, setScheduleView] = useState('cards'); // 'cards' | 'table'
  const [confirmModal, setConfirmModal] = useState(null);   // { title, message, confirmLabel, onConfirm } | null
  const [captainMode, setCaptainMode] = useState(false);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const scheduleRef = useRef(null);

  // Captain PIN — visible in source, this is a soft gate not real security
  const CAPTAIN_PIN = '1907';

  // Booking cutoffs:
  //   Wednesday — closes Tuesday 12:00 (noon); stays closed all day Wednesday;
  //               reopens Thursday (after the auto-clear on first load).
  //   Saturday / Sunday — closes 24 hours before throw-in (existing behaviour).
  // Captain mode always bypasses the cutoff.
  const CUTOFF_HOURS = 24; // Sat/Sun only
  const CONTACT_EMAIL = 'info@tedworthparkpolo.com';

  const isBookingClosed = (dayKey = activeDay) => {
    if (dayKey === 'wed') {
      const now = new Date();
      const dow = now.getDay(); // 0 Sun · 1 Mon · 2 Tue · 3 Wed · 4 Thu …
      const timeMin = now.getHours() * 60 + now.getMinutes();
      if (dow === 2 && timeMin >= 12 * 60) return true; // Tuesday from noon
      if (dow === 3) return true;                         // All day Wednesday
      return false;                                        // Thu–Mon + Tue morning: open
    }
    // Sat / Sun: close 24 hours before throw-in
    const cutoff = targetDayThrowIn(dayKey).getTime() - CUTOFF_HOURS * 60 * 60 * 1000;
    return Date.now() >= cutoff;
  };

  // Human-readable explanation shown in the booking-closed banner and handleAdd error.
  const bookingClosedReason = (dayKey = activeDay) => {
    if (dayKey === 'wed') {
      const dow = new Date().getDay();
      if (dow === 3) {
        return "This week's Wednesday chukkas are today. Sign-ups for next week open on Thursday once the roster has cleared.";
      }
      return "Sign-ups have closed for this Wednesday. The deadline is Tuesday at 12pm.";
    }
    return `Sign-ups close 24 hours before throw-in (${DAY_CONFIG[dayKey].eveningPrev} ${fmtTime(throwInMins[dayKey])}).`;
  };

  // Target throw-in datetime for a given day. Rolls forward to next week
  // after that day's throw-in time has passed. Used by the Sat/Sun 24h cutoff.
  const targetDayThrowIn = (dayKey) => {
    const cfg = DAY_CONFIG[dayKey];
    const startMin = throwInMins[dayKey];
    const now = new Date();
    const dow = now.getDay();
    let daysAhead;
    if (dow === cfg.dow) {
      const mins = now.getHours() * 60 + now.getMinutes();
      daysAhead = mins < startMin ? 0 : 7;
    } else {
      daysAhead = (cfg.dow - dow + 7) % 7;
    }
    const target = new Date(now);
    target.setDate(now.getDate() + daysAhead);
    target.setHours(Math.floor(startMin / 60), startMin % 60, 0, 0);
    return target;
  };

  // Check session storage on mount — captain mode persists until tab closes
  useEffect(() => {
    try {
      if (sessionStorage.getItem('tppc-captain') === '1') setCaptainMode(true);
    } catch (e) {}
  }, []);

  const openPinModal = () => {
    setPinInput('');
    setPinError('');
    setPinModalOpen(true);
  };

  const submitPin = () => {
    if (pinInput === CAPTAIN_PIN) {
      setCaptainMode(true);
      try { sessionStorage.setItem('tppc-captain', '1'); } catch (e) {}
      setPinModalOpen(false);
      setPinInput('');
      setPinError('');
    } else {
      setPinError('Wrong PIN — try again.');
      setPinInput('');
    }
  };

  const lockCaptainMode = () => {
    setCaptainMode(false);
    try { sessionStorage.removeItem('tppc-captain'); } catch (e) {}
  };

  // Hard refresh — clears caches and busts iOS's web-clip HTML cache.
  // Used by the manual refresh button and the prolonged-hidden listener below.
  const [refreshing, setRefreshing] = useState(false);

  const hardRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {}
    // small delay so the user sees the spinner — proves the tap registered
    await new Promise(r => setTimeout(r, 400));
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('_t', Date.now().toString());
      window.location.href = url.toString();
    } catch (e) {
      window.location.reload();
    }
  };

  // Auto-refresh when the user returns to the app after being away >5 minutes.
  // Fixes iOS PWA shortcuts that hold stale builds when Safari caches index.html.
  useEffect(() => {
    let hiddenAt = null;
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        hiddenAt = Date.now();
      } else if (hiddenAt && Date.now() - hiddenAt > 5 * 60 * 1000) {
        hiddenAt = null;
        hardRefresh();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // Storage keys are suffixed by day, except Wed which keeps its original
  // un-suffixed keys to preserve existing Firestore data.
  const storageKey = (base, dayKey) => dayKey === 'wed' ? base : `${base}-${dayKey}`;

  // Load shared data
  useEffect(() => {
    const loadAll = async () => {
      // Auto-clear stale rosters per day: if a roster was stamped for a past
      // day, that day's chukkas are done — wipe it from Firestore so the next
      // person sees a fresh empty roster for the upcoming day.
      for (const dk of DAY_KEYS) {
        try {
          const rw = await window.storage.get(storageKey('roster-week', dk), true);
          const storedWeek = rw?.value;
          if (storedWeek && storedWeek < currentDayISO(dk)) {
            await Promise.all([
              window.storage.delete(storageKey('roster', dk), true).catch(() => {}),
              window.storage.delete(storageKey('roster-week', dk), true).catch(() => {}),
              window.storage.delete(storageKey('schedule', dk), true).catch(() => {}),
            ]);
          }
        } catch (e) {}
      }

      // Load per-day rosters, schedules and throw-in times
      const nextRosters = { wed: [], thu: [], sat: [], sun: [] };
      const nextSchedules = { wed: null, thu: null, sat: null, sun: null };
      const nextThrowIns = {
        wed: DAY_CONFIG.wed.defaultStartMin,
        thu: DAY_CONFIG.thu.defaultStartMin,
        sat: DAY_CONFIG.sat.defaultStartMin,
        sun: DAY_CONFIG.sun.defaultStartMin,
      };
      for (const dk of DAY_KEYS) {
        try {
          const r = await window.storage.get(storageKey('roster', dk), true);
          if (r?.value) nextRosters[dk] = JSON.parse(r.value);
        } catch (e) {}
        try {
          const s = await window.storage.get(storageKey('schedule', dk), true);
          if (s?.value) nextSchedules[dk] = JSON.parse(s.value);
        } catch (e) {}
        try {
          const t = await window.storage.get(storageKey('throwin', dk), true);
          if (t?.value) {
            const parsed = parseTime(t.value);
            if (parsed !== null) nextThrowIns[dk] = parsed;
          }
        } catch (e) {}
      }
      setRosters(nextRosters);
      setSchedules(nextSchedules);
      setThrowInMins(nextThrowIns);

      try {
        const f = await window.storage.get('fixture-interest', true);
        if (f?.value) setInterest(JSON.parse(f.value));
      } catch (e) {}
      try {
        const w = await window.storage.get('wa-link', true);
        if (w?.value) setWaLink(w.value);
      } catch (e) {}
      try {
        const m = await window.storage.get('members', true);
        if (m?.value) setMembers(JSON.parse(m.value));
      } catch (e) {}
      setLoaded(true);
    };
    loadAll();
    const onRemoteChange = () => loadAll();
    window.addEventListener('storage-changed', onRemoteChange);
    return () => window.removeEventListener('storage-changed', onRemoteChange);
  }, []);

  // When the throw-in time changes, clear any pending availableFrom / availableTo
  // values that no longer correspond to a valid option in the updated dropdowns.
  // This prevents the selects showing a stale time that isn't in the option list.
  useEffect(() => {
    const fromOptions = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(i => fmtTime(throwInMin + i * CHUKKA_INTERVAL_MIN)));
    const toOptions   = new Set([0, 1, 2, 3, 4, 5, 6, 7].map(i => fmtTime(throwInMin + i * CHUKKA_INTERVAL_MIN)));
    if (availableFrom && !fromOptions.has(availableFrom)) setAvailableFrom('');
    if (availableTo   && !toOptions.has(availableTo))     setAvailableTo('');
  }, [throwInMin]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Chukkas — day-aware save helpers ─────────────────────────────────
  const saveRoster = async (newPlayers, dayKey = activeDay) => {
    setRosters(prev => ({ ...prev, [dayKey]: newPlayers }));
    try {
      await window.storage.set(storageKey('roster', dayKey), JSON.stringify(newPlayers), true);
      // Stamp which day this roster is for, so we can auto-clear after.
      // Only stamp non-empty rosters; clearing means no stamp.
      if (newPlayers.length > 0) {
        await window.storage.set(storageKey('roster-week', dayKey), currentDayISO(dayKey), true);
      } else {
        try { await window.storage.delete(storageKey('roster-week', dayKey), true); } catch (e) {}
      }
    } catch (e) { setError('Saved locally only — check your connection.'); }
  };

  // Save schedule to Firestore so it syncs across devices.
  // Pass null to clear (e.g. when roster changes invalidate the draw).
  const saveSchedule = async (nextSchedule, dayKey = activeDay) => {
    setSchedules(prev => ({ ...prev, [dayKey]: nextSchedule }));
    try {
      if (nextSchedule === null) {
        await window.storage.delete(storageKey('schedule', dayKey), true);
      } else {
        await window.storage.set(storageKey('schedule', dayKey), JSON.stringify(nextSchedule), true);
      }
    } catch (e) {
      setError('Schedule saved locally only — check your connection.');
    }
  };

  // Update the directory with this player's details (for next time's autofill)
  const upsertMember = async (player, extraMembers = members) => {
    const key = (player.name || '').trim().toLowerCase();
    if (!key) return extraMembers;
    const updated = {
      ...extraMembers,
      [key]: {
        name: player.name.trim(),
        handicap: player.handicap,
        mobile: player.mobile || '',
        availableFrom: player.availableFrom || '',
        availableTo: player.availableTo || '',
        lastUsed: Date.now(),
      },
    };
    setMembers(updated);
    try { await window.storage.set('members', JSON.stringify(updated), true); } catch (e) {}
    return updated;
  };

  // Fill the booking form from a saved member
  const fillFromMember = (m) => {
    setName(m.name);
    setMobile(m.mobile || '');
    setHandicap(String(m.handicap));
    setAvailableFrom(m.availableFrom || '');
    setAvailableTo(m.availableTo || '');
    // Leave chukkas blank — varies week to week
  };

  const handleAdd = () => {
    setError('');
    // Booking cutoff: 24h before Wednesday 17:30. Captain bypasses.
    if (!captainMode && isBookingClosed()) {
      return setError(`${bookingClosedReason()} To be added, please contact the captain at ${CONTACT_EMAIL}.`);
    }
    if (!name.trim()) return setError('Please enter a name.');
    if (handicap === '') return setError('Please select a handicap.');
    if (!chukkas) return setError('How many chukkas?');
    const h = parseInt(handicap, 10);
    const c = parseInt(chukkas, 10);
    if (isNaN(c) || c < 1 || c > 8) return setError('Chukkas must be between 1 and 8.');
    // Sanity check: if both bounds are set, availableTo must not be earlier than availableFrom.
    if (availableFrom && availableTo) {
      const fromMin = parseTime(availableFrom);
      const toMin = parseTime(availableTo);
      if (fromMin !== null && toMin !== null && toMin < fromMin) {
        return setError('"Available to" must be the same as or later than "Available from".');
      }
    }
    // Prevent the same person being added twice (case- and whitespace-insensitive)
    const cleanedName = name.trim().replace(/\s+/g, ' ');
    const normalized = cleanedName.toLowerCase();
    const existing = players.find(p => p.name.trim().replace(/\s+/g, ' ').toLowerCase() === normalized);
    if (existing) {
      return setError(`${existing.name} is already on the roster${captainMode ? ' — adjust their chukkas with the +/− buttons.' : ' for this Wednesday.'}`);
    }
    const newPlayer = {
      id: Date.now(),
      name: cleanedName,
      mobile: mobile.trim() || undefined,
      handicap: h,
      chukkas: c,
      // Stored as HH:MM string; empty = available from the throw-in (default)
      availableFrom: availableFrom || fmtTime(throwInMin),
      // Stored as HH:MM string; empty = no upper cap (play through last chukka)
      availableTo: availableTo || '',
    };
    saveRoster([...players, newPlayer]);
    upsertMember(newPlayer);
    setName(''); setMobile(''); setHandicap(''); setChukkas(''); setAvailableFrom(''); setAvailableTo('');
    saveSchedule(null);
  };

  const removePlayer = (id) => {
    saveRoster(players.filter(p => p.id !== id));
    saveSchedule(null);
  };

  const generate = () => {
    if (players.length < 4) { setError('Need at least 4 players for a chukka.'); return; }
    setError('');
    setActivePlayer(null);
    setAddingTo(null);
    const result = buildSchedule(players, throwInMin);
    saveSchedule(result);
    setTimeout(() => scheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  };

  const clearAll = () => {
    setConfirmModal({
      title: 'Clear the roster?',
      message: 'This removes all players and discards the current schedule. The members directory, fixtures, and WhatsApp link are kept.',
      confirmLabel: 'Clear roster',
      onConfirm: () => {
        saveRoster([]);
        saveSchedule(null);
      },
    });
  };

  const loadExample = async (key) => {
    const ex = EXAMPLES[key];
    if (!ex) return;
    const doLoad = async () => {
      const now = Date.now();
      const seeded = ex.roster.map((p, i) => ({ id: now + i, ...p }));
      saveRoster(seeded);
      const newMembers = { ...members };
      seeded.forEach((p, i) => {
        newMembers[p.name.toLowerCase()] = {
          name: p.name,
          handicap: p.handicap,
          mobile: p.mobile || '',
          availableFrom: p.availableFrom || '',
          availableTo: p.availableTo || '',
          lastUsed: now - (seeded.length - i),
        };
      });
      setMembers(newMembers);
      try { await window.storage.set('members', JSON.stringify(newMembers), true); } catch (e) {}
      saveSchedule(null);
    };
    if (players.length > 0) {
      setConfirmModal({
        title: `Replace the roster?`,
        message: `This replaces the current roster with the ${ex.label} example.`,
        confirmLabel: 'Replace',
        onConfirm: () => { doLoad(); },
      });
    } else {
      doLoad();
    }
  };

  // Adjust a player's chukka count in the roster
  const adjustChukkas = (id, delta) => {
    const updated = players.map(p =>
      p.id === id
        ? { ...p, chukkas: Math.max(1, Math.min(8, p.chukkas + delta)) }
        : p
    );
    saveRoster(updated);
    saveSchedule(null); // Roster changed — invalidate the schedule
  };

  // Move a player up (-1) or down (+1) in the roster array.
  // Roster order controls scheduling priority: earlier = first pick of chukkas.
  const movePlayer = (id, dir) => {
    const idx = players.findIndex(p => p.id === id);
    if (idx < 0) return;
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= players.length) return;
    const updated = [...players];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    saveRoster(updated);
    saveSchedule(null);
  };

  // Sort the roster so players wanting the most chukkas appear first.
  // Ties are broken by current roster position (stable sort).
  const sortByChukkas = () => {
    const updated = [...players].sort((a, b) => b.chukkas - a.chukkas);
    saveRoster(updated);
    saveSchedule(null);
  };

  // Update a single availability field (availableFrom or availableTo) for a player.
  const updateAvail = (id, field, value) => {
    const updated = players.map(p => p.id === id ? { ...p, [field]: value } : p);
    saveRoster(updated);
    saveSchedule(null);
  };

  // Recompute sums and counts after a schedule mutation
  const refreshChukka = (ck) => ({
    ...ck,
    sumA: ck.teamA.reduce((s, p) => s + p.handicap, 0),
    sumB: ck.teamB.reduce((s, p) => s + p.handicap, 0),
    playerCount: ck.teamA.length + ck.teamB.length,
  });

  const updateSchedule = (mapper) => {
    if (!schedule) return;
    const next = schedule.chukkas.map((ck, idx) => refreshChukka(mapper(ck, idx)));
    saveSchedule({ ...schedule, chukkas: next });
  };

  const swapPlayerTeam = (chukkaIdx, playerId) => {
    if (!schedule) return;
    const ck = schedule.chukkas[chukkaIdx];
    const inA = ck.teamA.find(p => p.id === playerId);
    const inB = ck.teamB.find(p => p.id === playerId);
    if (inA && ck.teamB.length >= 4) {
      window.alert('White team is already at 4 players (max). Remove someone first or use Move to another chukka.');
      return;
    }
    if (inB && ck.teamA.length >= 4) {
      window.alert('Blue team is already at 4 players (max). Remove someone first or use Move to another chukka.');
      return;
    }
    updateSchedule((ck, idx) => {
      if (idx !== chukkaIdx) return ck;
      if (inA) {
        return {
          ...ck,
          teamA: ck.teamA.filter(p => p.id !== playerId),
          teamB: [...ck.teamB, inA],
        };
      }
      if (inB) {
        return {
          ...ck,
          teamB: ck.teamB.filter(p => p.id !== playerId),
          teamA: [...ck.teamA, inB],
        };
      }
      return ck;
    });
    setActivePlayer(null);
  };

  const removeFromChukka = (chukkaIdx, playerId) => {
    updateSchedule((ck, idx) =>
      idx === chukkaIdx
        ? {
            ...ck,
            teamA: ck.teamA.filter(p => p.id !== playerId),
            teamB: ck.teamB.filter(p => p.id !== playerId),
          }
        : ck
    );
    setActivePlayer(null);
  };

  const movePlayerToChukka = (fromIdx, playerId, toIdx) => {
    if (!schedule || fromIdx === toIdx) return;
    const target = schedule.chukkas[toIdx];
    if (target.teamA.length >= 4 && target.teamB.length >= 4) {
      window.alert(`Chukka ${toIdx + 1} is already full (4v4).`);
      return;
    }
    const fromChukka = schedule.chukkas[fromIdx];
    const player =
      fromChukka.teamA.find(p => p.id === playerId) ||
      fromChukka.teamB.find(p => p.id === playerId);
    if (!player) return;

    updateSchedule((ck, idx) => {
      if (idx === fromIdx) {
        return {
          ...ck,
          teamA: ck.teamA.filter(p => p.id !== playerId),
          teamB: ck.teamB.filter(p => p.id !== playerId),
        };
      }
      if (idx === toIdx) {
        const already = ck.teamA.find(p => p.id === playerId) || ck.teamB.find(p => p.id === playerId);
        if (already) return ck;
        // Drop into the smaller team (respecting 4-per-team cap)
        if (ck.teamA.length < 4 && (ck.teamA.length <= ck.teamB.length || ck.teamB.length >= 4)) {
          return { ...ck, teamA: [...ck.teamA, player] };
        }
        return { ...ck, teamB: [...ck.teamB, player] };
      }
      return ck;
    });
    setActivePlayer(null);
  };

  const addToChukka = (chukkaIdx, playerId) => {
    const player = players.find(p => p.id === playerId);
    if (!player || !schedule) return;
    const ck = schedule.chukkas[chukkaIdx];
    if (ck.teamA.length >= 4 && ck.teamB.length >= 4) {
      window.alert(`Chukka ${chukkaIdx + 1} is already full (4v4).`);
      return;
    }
    updateSchedule((ck, idx) => {
      if (idx !== chukkaIdx) return ck;
      const already = ck.teamA.find(p => p.id === playerId) || ck.teamB.find(p => p.id === playerId);
      if (already) return ck;
      if (ck.teamA.length < 4 && (ck.teamA.length <= ck.teamB.length || ck.teamB.length >= 4)) {
        return { ...ck, teamA: [...ck.teamA, player] };
      }
      return { ...ck, teamB: [...ck.teamB, player] };
    });
    setAddingTo(null);
  };

  // ── WhatsApp integration ─────────────────────────────
  const saveWaLink = async (link) => {
    const cleaned = link.trim();
    setWaLink(cleaned);
    try { await window.storage.set('wa-link', cleaned, true); } catch (e) {}
    setWaEditing(false);
  };

  const generateTeamSheet = () => {
    if (!schedule) return '';
    const dateStr = getDateStr();

    let text = `*Tedworth Park Polo Club*\n`;
    text += `_${activeDayConfig.fullLabel} Chukkas — ${dateStr}_\n`;
    text += `🐎 ${schedule.numChukkas} chukkas, ${chukkaTime(0, throwInMin)} throw-in\n\n`;

    schedule.chukkas.forEach(ck => {
      const diff = Math.abs(ck.sumA - ck.sumB);
      text += `*Chukka ${ck.number} · ${ck.time}*  (${ck.teamA.length}v${ck.teamB.length}`;
      if (ck.playerCount > 0) text += ` · Δ${diff}`;
      text += `)\n`;
      if (ck.teamA.length > 0) {
        text += `🔵 ${ck.teamA.map(p => `${p.name} (${fmtH(p.handicap)})`).join(', ')}\n`;
      }
      if (ck.teamB.length > 0) {
        text += `⚪ ${ck.teamB.map(p => `${p.name} (${fmtH(p.handicap)})`).join(', ')}\n`;
      }
      if (ck.playerCount === 0) text += `_no players_\n`;
      text += '\n';
    });

    if (schedule.reduced && schedule.reduced.length > 0) {
      text += `_Reduced for fairness: ${schedule.reduced.map(r => `${r.player.name} (${r.given} of ${r.requested})`).join(', ')}_\n\n`;
    }

    text += `🏇 See you on the field!`;
    return text;
  };

  // Captain-style monospace table for WhatsApp / email
  const generateTableText = () => {
    if (!schedule) return '';
    const dateStr = getDateStr();

    // Sort players by handicap descending (captain's convention)
    const sorted = [...players].sort((a, b) => b.handicap - a.handicap);
    const nameWidth = Math.max(...sorted.map(p => p.name.length), 4);

    // Helper to compute what cell to show for a player in a chukka
    const cellFor = (p, ck) => {
      if (ck.teamA.find(x => x.id === p.id)) return 'B';
      if (ck.teamB.find(x => x.id === p.id)) return 'W';
      return ' ';
    };

    // Header lines
    let header = 'Name'.padEnd(nameWidth) + ' HCP  C ';
    schedule.chukkas.forEach((_, i) => { header += ' ' + (i + 1); });

    const rows = sorted.map(p => {
      let row = p.name.padEnd(nameWidth);
      row += ' ' + fmtH(p.handicap).padStart(3);
      row += '  ' + String(p.chukkas);
      row += ' ';
      schedule.chukkas.forEach(ck => { row += ' ' + cellFor(p, ck); });
      return row.trimEnd();
    });

    const times = schedule.chukkas.map(c => c.time).join(' · ');

    let text = `*Tedworth Park Polo Club*\n`;
    text += `_${activeDayConfig.fullLabel} Chukkas — ${dateStr}_\n`;
    text += `🐎 Chukkas: ${times}\n\n`;
    text += '```\n';
    text += header + '\n';
    text += rows.join('\n') + '\n';
    text += '```';

    if (schedule.reduced && schedule.reduced.length > 0) {
      text += `\n\n_Reduced: ${schedule.reduced.map(r => `${r.player.name} (${r.given}/${r.requested})`).join(', ')}_`;
    }

    return text;
  };

  const publishToWhatsApp = async () => {
    const blob = await generatePNGBlob();
    if (!blob) return;

    const filename = `TPPC-chukkas-${getDateSlug()}.png`;
    const file = new File([blob], filename, { type: 'image/png' });

    // Try Web Share API with files (mobile-first: lets user pick WhatsApp from
    // the system share sheet and the image is attached to the message).
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: `${activeDayConfig.fullLabel} Chukkas`,
        });
        return;
      } catch (err) {
        // User cancelled — that's fine, don't fall back to download
        if (err && err.name === 'AbortError') return;
      }
    }

    // Fallback: download the PNG so the user can share it manually
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
    window.alert('Team sheet saved as PNG. Open WhatsApp and send the image to the club group.');
  };

  const copyTeamSheet = async () => {
    const text = scheduleView === 'table' ? generateTableText() : generateTeamSheet();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      window.alert('Team sheet copied to clipboard.');
    } catch (e) {
      window.alert('Could not copy automatically — long-press to copy from the preview.');
    }
  };

  // Compute the date of the next occurrence of a given day-of-week from today
  // (or today if today IS that day). Returns local-midnight on the target day.
  const nextDayOfWeek = (targetDow) => {
    const d = new Date();
    const dow = d.getDay();
    const daysUntil = (targetDow - dow + 7) % 7;
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    target.setDate(d.getDate() + daysUntil);
    return target;
  };
  const nextChukkaDate = (dayKey = activeDay) => nextDayOfWeek(DAY_CONFIG[dayKey].dow);

  // Local-time ISO date string (YYYY-MM-DD) — avoids UTC drift in BST/GMT.
  // Used to stamp the roster's day so the app can auto-clear last week's data.
  const localISO = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const currentDayISO = (dayKey = activeDay) => localISO(nextChukkaDate(dayKey));

  // Build a filename-safe date slug (YYYY-MM-DD) and human date string for the
  // active day's next occurrence (used in exports, share text, etc.)
  const getDateSlug = (dayKey = activeDay) => localISO(nextChukkaDate(dayKey));
  const getDateStr = (dayKey = activeDay) =>
    nextChukkaDate(dayKey).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  // ── Export as Excel (.xlsx) ─────────────────────────
  // ── Export as Excel (.xls) styled to match the in-app table view ─────
  // Uses HTML format with Office Excel namespaces — Excel/Numbers/Sheets
  // open it as a styled spreadsheet (the same trick used for years).
  const exportXLSX = () => {
    if (!schedule) return;
    const sortedPlayers = [...players].sort((a, b) => b.handicap - a.handicap);
    const dateStr = getDateStr();

    const headerDate = `style="background-color:#6b1f2a; color:#f4ecd8; font-family:Georgia,serif; font-style:italic; font-weight:500; text-align:center; padding:10px; border:1px solid #d4c8a8; font-size:13px;"`;
    const headerTime = `style="background-color:#e9dec3; color:#6b1f2a; font-weight:600; text-align:center; padding:8px; border:1px solid #d4c8a8; font-size:12px; mso-number-format:'\\@';"`;
    const headerCol = `style="background-color:#6b1f2a; color:#f4ecd8; font-weight:500; text-align:center; padding:8px; border:1px solid #d4c8a8; font-size:11px;"`;
    const headerChukka = `style="background-color:#e9dec3; color:#6b1f2a; font-weight:500; text-align:center; padding:8px; border:1px solid #d4c8a8; font-size:11px;"`;
    const cellB = `style="background-color:#dde6f0; color:#1e3552; font-weight:700; text-align:center; padding:8px; font-family:Georgia,serif; border:1px solid #d4c8a8; font-size:14px;"`;
    const cellW = `style="background-color:#f5ecd9; color:#6b1f2a; font-weight:700; text-align:center; padding:8px; font-family:Georgia,serif; border:1px solid #d4c8a8; font-size:14px;"`;
    const cellEmpty = `style="background-color:#ffffff; padding:8px; border:1px solid #d4c8a8;"`;

    let html = '';
    html += `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">`;
    html += `<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">`;
    html += `<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>`;
    html += `<x:Name>Chukkas</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>`;
    html += `</x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->`;
    html += `<style>td { mso-number-format:'\\@'; }</style></head><body>`;
    html += `<table border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse; font-family:Arial,sans-serif;">`;

    // Row 1: Date (merged cols 0–2) + time headers
    html += `<tr>`;
    html += `<td colspan="3" ${headerDate}>${dateStr}</td>`;
    schedule.chukkas.forEach(ck => {
      html += `<td ${headerTime}>${ck.time}</td>`;
    });
    html += `</tr>`;

    // Row 2: column headers
    html += `<tr>`;
    html += `<td ${headerCol}>Name</td>`;
    html += `<td ${headerCol}>Handicap</td>`;
    html += `<td ${headerCol}>Chukkas</td>`;
    schedule.chukkas.forEach((_, i) => {
      html += `<td ${headerChukka}>Chukka ${i + 1}</td>`;
    });
    html += `</tr>`;

    // Player rows
    sortedPlayers.forEach((p, idx) => {
      const altBg = idx % 2 === 1 ? '#faf5e6' : '#ffffff';
      html += `<tr>`;
      html += `<td style="background-color:${altBg}; padding:8px 12px; font-weight:500; color:#1c1612; border:1px solid #d4c8a8; font-size:12px;">${p.name}</td>`;
      html += `<td style="background-color:#ffffff; text-align:center; padding:8px; color:#1c1612; border:1px solid #d4c8a8; font-size:12px;">${fmtH(p.handicap)}</td>`;
      html += `<td style="background-color:#ffffff; text-align:center; padding:8px; color:#1c1612; border:1px solid #d4c8a8; font-size:12px;">${p.chukkas}</td>`;
      schedule.chukkas.forEach(ck => {
        const inA = ck.teamA.find(x => x.id === p.id);
        const inB = ck.teamB.find(x => x.id === p.id);
        if (inA) html += `<td ${cellB}>B</td>`;
        else if (inB) html += `<td ${cellW}>W</td>`;
        else html += `<td ${cellEmpty}></td>`;
      });
      html += `</tr>`;
    });

    html += `</table></body></html>`;

    // BOM helps Excel detect UTF-8 properly
    const blob = new Blob(['\ufeff' + html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TPPC-chukkas-${getDateSlug()}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ── Render the team-sheet to a Canvas (reusable for PNG export + WhatsApp share) ──
  const renderScheduleCanvas = () => {
    if (!schedule) return null;
    const sortedPlayers = [...players].sort((a, b) => b.handicap - a.handicap);
    const dateStr = getDateStr();
    const N = schedule.numChukkas;

    // Layout constants (logical pixels — canvas is 2× for retina)
    const padding = 24;
    const titleH = 60;
    const headerRowH = 38;
    const rowH = 34;
    const nameW = 160;
    const hcpW = 60;
    const chukkasW = 60;
    const chukkaW = 90;

    const tableW = nameW + hcpW + chukkasW + chukkaW * N;
    const tableH = headerRowH * 2 + rowH * sortedPlayers.length;
    const W = padding * 2 + tableW;
    const H = padding * 2 + titleH + tableH;

    // High-DPI canvas
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = W * scale;
    canvas.height = H * scale;
    const ctx = canvas.getContext('2d');
    ctx.scale(scale, scale);

    // Background
    ctx.fillStyle = '#f4ecd8';
    ctx.fillRect(0, 0, W, H);

    // Title block
    ctx.fillStyle = '#6b1f2a';
    ctx.font = '500 22px Georgia, "Times New Roman", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tedworth Park Polo Club', W / 2, padding + 16);
    ctx.fillStyle = '#6b5e4e';
    ctx.font = 'italic 13px Georgia, "Times New Roman", serif';
    ctx.fillText(`${activeDayConfig.fullLabel} Chukkas · ${dateStr}`, W / 2, padding + 40);

    // Table position
    const tx = (W - tableW) / 2;
    let y = padding + titleH;

    // Row 1: date (merged across cols 0–2) + time headers
    ctx.fillStyle = '#6b1f2a';
    ctx.fillRect(tx, y, nameW + hcpW + chukkasW, headerRowH);
    ctx.fillStyle = '#f4ecd8';
    ctx.font = 'italic 500 13px Georgia, serif';
    ctx.fillText(dateStr, tx + (nameW + hcpW + chukkasW) / 2, y + headerRowH / 2);

    schedule.chukkas.forEach((ck, i) => {
      const cx = tx + nameW + hcpW + chukkasW + i * chukkaW;
      ctx.fillStyle = '#e9dec3';
      ctx.fillRect(cx, y, chukkaW, headerRowH);
      ctx.fillStyle = '#6b1f2a';
      ctx.font = '600 12px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.fillText(ck.time, cx + chukkaW / 2, y + headerRowH / 2);
    });
    y += headerRowH;

    // Row 2: column labels
    ctx.fillStyle = '#6b1f2a';
    ctx.fillRect(tx, y, nameW + hcpW + chukkasW, headerRowH);
    ctx.fillStyle = '#f4ecd8';
    ctx.font = '500 11px -apple-system, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('NAME', tx + nameW / 2, y + headerRowH / 2);
    ctx.fillText('HCP', tx + nameW + hcpW / 2, y + headerRowH / 2);
    ctx.fillText('C', tx + nameW + hcpW + chukkasW / 2, y + headerRowH / 2);
    schedule.chukkas.forEach((_, i) => {
      const cx = tx + nameW + hcpW + chukkasW + i * chukkaW;
      ctx.fillStyle = '#e9dec3';
      ctx.fillRect(cx, y, chukkaW, headerRowH);
      ctx.fillStyle = '#6b1f2a';
      ctx.fillText(`CHUKKA ${i + 1}`, cx + chukkaW / 2, y + headerRowH / 2);
    });
    y += headerRowH;

    // Player rows
    sortedPlayers.forEach((p, idx) => {
      const isAlt = idx % 2 === 1;

      // Name column (alt row shade)
      ctx.fillStyle = isAlt ? '#faf5e6' : '#ffffff';
      ctx.fillRect(tx, y, nameW, rowH);
      ctx.fillStyle = '#1c1612';
      ctx.font = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(p.name, tx + 12, y + rowH / 2);

      // HCP + Chukkas columns
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(tx + nameW, y, hcpW + chukkasW, rowH);
      ctx.fillStyle = '#1c1612';
      ctx.font = '500 13px -apple-system, "Helvetica Neue", Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(fmtH(p.handicap), tx + nameW + hcpW / 2, y + rowH / 2);
      ctx.fillText(String(p.chukkas), tx + nameW + hcpW + chukkasW / 2, y + rowH / 2);

      // Chukka cells
      schedule.chukkas.forEach((ck, ci) => {
        const inA = ck.teamA.find(x => x.id === p.id);
        const inB = ck.teamB.find(x => x.id === p.id);
        const cx = tx + nameW + hcpW + chukkasW + ci * chukkaW;
        if (inA) {
          ctx.fillStyle = 'rgba(42, 74, 110, 0.15)';
          ctx.fillRect(cx, y, chukkaW, rowH);
          ctx.fillStyle = '#1e3552';
          ctx.font = '700 15px Georgia, serif';
          ctx.fillText('B', cx + chukkaW / 2, y + rowH / 2);
        } else if (inB) {
          ctx.fillStyle = 'rgba(184, 146, 74, 0.14)';
          ctx.fillRect(cx, y, chukkaW, rowH);
          ctx.fillStyle = '#6b1f2a';
          ctx.font = '700 15px Georgia, serif';
          ctx.fillText('W', cx + chukkaW / 2, y + rowH / 2);
        } else {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx, y, chukkaW, rowH);
        }
      });

      y += rowH;
    });

    // Grid lines
    ctx.strokeStyle = '#d4c8a8';
    ctx.lineWidth = 1;
    const colWidths = [nameW, hcpW, chukkasW, ...Array(N).fill(chukkaW)];
    let lineX = tx;
    for (let i = 0; i <= colWidths.length; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.round(lineX) + 0.5, padding + titleH);
      ctx.lineTo(Math.round(lineX) + 0.5, padding + titleH + tableH);
      ctx.stroke();
      if (i < colWidths.length) lineX += colWidths[i];
    }
    const rowHeights = [headerRowH, headerRowH, ...Array(sortedPlayers.length).fill(rowH)];
    let lineY = padding + titleH;
    for (let i = 0; i <= rowHeights.length; i++) {
      ctx.beginPath();
      ctx.moveTo(tx, Math.round(lineY) + 0.5);
      ctx.lineTo(tx + tableW, Math.round(lineY) + 0.5);
      ctx.stroke();
      if (i < rowHeights.length) lineY += rowHeights[i];
    }

    return canvas;
  };

  // Async helper: render and resolve a PNG Blob
  const generatePNGBlob = () => new Promise(resolve => {
    const canvas = renderScheduleCanvas();
    if (!canvas) return resolve(null);
    canvas.toBlob(blob => resolve(blob), 'image/png');
  });

  // ── Export as PNG (download) ─────────────────────────
  const exportPNG = async () => {
    const blob = await generatePNGBlob();
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TPPC-chukkas-${getDateSlug()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  };

  // ── Fixtures interest ─────────────────────────────────
  const saveInterest = async (next) => {
    setInterest(next);
    try { await window.storage.set('fixture-interest', JSON.stringify(next), true); }
    catch (e) { setFError('Saved locally only — check your connection.'); }
  };

  const registerInterest = (fixtureId) => {
    setFError('');
    if (!fName.trim()) return setFError('Please enter your name.');
    if (fHandicap === '') return setFError('Please select your handicap.');
    const cleanedEmail = fEmail.trim();
    if (cleanedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedEmail)) {
      return setFError('That email address looks off — please double-check.');
    }
    const entry = {
      id: Date.now(),
      name: fName.trim(),
      handicap: parseInt(fHandicap, 10),
    };
    if (fMobile.trim()) entry.mobile = fMobile.trim();
    if (cleanedEmail) entry.email = cleanedEmail;
    const list = interest[fixtureId] || [];
    saveInterest({ ...interest, [fixtureId]: [...list, entry] });
    setFName(''); setFHandicap(''); setFMobile(''); setFEmail('');
  };

  const removeInterest = (fixtureId, entryId) => {
    const list = (interest[fixtureId] || []).filter(p => p.id !== entryId);
    const next = { ...interest };
    if (list.length === 0) delete next[fixtureId];
    else next[fixtureId] = list;
    saveInterest(next);
  };

  const toggleFixture = (id) => {
    setFError('');
    setFName(''); setFHandicap(''); setFMobile(''); setFEmail('');
    setExpandedId(expandedId === id ? null : id);
  };

  const totalChukkas = players.reduce((s, p) => s + p.chukkas, 0);
  const totalRegistrations = Object.values(interest).reduce((s, arr) => s + arr.length, 0);

  // Autofill suggestions: members not yet in the roster, filtered by typed text
  const nameInputLower = name.trim().toLowerCase();
  const rosterNames = new Set(players.map(p => p.name.toLowerCase()));
  const suggestions = Object.values(members)
    .filter(m => !rosterNames.has(m.name.toLowerCase()))
    .filter(m => nameInputLower === '' || m.name.toLowerCase().includes(nameInputLower))
    .sort((a, b) => (b.lastUsed || 0) - (a.lastUsed || 0))
    .slice(0, 8);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Outfit:wght@300;400;500;600;700&display=swap');

        .polo-app {
          --burgundy: #6b1f2a;
          --burgundy-deep: #4a1419;
          --burgundy-soft: #8a2f3a;
          --cream: #f4ecd8;
          --cream-warm: #e9dec3;
          --cream-pale: #faf5e6;
          --gold: #b8924a;
          --gold-bright: #d4a85a;
          --ink: #1c1612;
          --muted: #6b5e4e;
          --line: #d4c8a8;
          --danger: #9a2a2a;
          --blue: #2a4a6e;
          --blue-deep: #1e3552;
          --white-team: #ffffff;
          --white-team-border: #c8b890;
          --wa: #25D366;
          --wa-deep: #128C7E;
          font-family: 'Outfit', system-ui, sans-serif;
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
          line-height: 1.4;
        }
        .polo-app * { box-sizing: border-box; }
        .display { font-family: 'Fraunces', Georgia, serif; font-weight: 500; }
        .display-italic { font-family: 'Fraunces', Georgia, serif; font-style: italic; font-weight: 400; }
        .label-eyebrow {
          font-family: 'Fraunces', serif;
          font-style: italic;
          color: var(--muted);
          font-size: 13px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }
        .header-bg {
          background: var(--burgundy);
          color: var(--cream);
          position: relative;
          overflow: hidden;
        }
        .header-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 18% 28%, rgba(212, 168, 90, 0.10) 0%, transparent 55%),
            radial-gradient(circle at 82% 78%, rgba(212, 168, 90, 0.06) 0%, transparent 45%);
          pointer-events: none;
        }
        .ornament {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 14px auto;
        }
        .ornament-line { width: 36px; height: 1px; background: var(--gold); }
        .ornament-dot { width: 5px; height: 5px; background: var(--gold); transform: rotate(45deg); }

        .tabs {
          display: flex;
          background: var(--burgundy-deep);
          padding: 0;
          border-bottom: 1px solid rgba(184, 146, 74, 0.4);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .tab-btn {
          flex: 1;
          background: transparent;
          border: none;
          padding: 14px 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(244, 236, 216, 0.55);
          cursor: pointer;
          transition: color 0.2s;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
        }
        .tab-btn:hover { color: var(--cream); }
        .tab-btn.active {
          color: var(--cream);
          border-bottom-color: var(--gold);
        }

        .card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 6px;
        }
        .input-field {
          width: 100%;
          padding: 14px 16px;
          background: var(--cream-pale);
          border: 1px solid var(--line);
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          color: var(--ink);
          transition: all 0.2s;
          -webkit-appearance: none;
          appearance: none;
        }
        .input-field:focus {
          outline: none;
          border-color: var(--burgundy);
          background: white;
          box-shadow: 0 0 0 3px rgba(107, 31, 42, 0.10);
        }
        .input-field::placeholder { color: #b8ad8e; }
        .select-field {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3e%3cpath fill='none' stroke='%236b5e4e' stroke-width='1.5' d='M1 1.5l5 5 5-5'/%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
        }
        .btn-primary {
          background: var(--burgundy);
          color: var(--cream);
          border: none;
          padding: 15px 24px;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-primary:hover:not(:disabled) { background: var(--burgundy-deep); }
        .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-secondary {
          background: transparent;
          color: var(--burgundy);
          border: 1px solid var(--burgundy);
          padding: 13px 20px;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s;
          width: 100%;
        }
        .btn-secondary:hover { background: var(--burgundy); color: var(--cream); }

        .player-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px;
          background: white;
          border: 1px solid var(--line);
          border-radius: 4px;
          margin-bottom: 8px;
          transition: all 0.2s;
        }
        .player-row:hover { border-color: var(--gold); }
        .handicap-badge {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          background: var(--burgundy);
          color: var(--cream);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 15px;
        }
        .handicap-badge.gold { background: var(--gold); }
        .chukka-pill {
          background: var(--cream-warm);
          color: var(--burgundy);
          padding: 5px 11px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--line);
          white-space: nowrap;
        }
        /* Inline +/− adjuster for chukka count */
        .chukka-stepper {
          display: inline-flex;
          align-items: center;
          gap: 0;
          border: 1px solid var(--line);
          border-radius: 14px;
          overflow: hidden;
          background: var(--cream-warm);
        }
        .step-btn {
          background: transparent;
          border: none;
          width: 26px;
          height: 26px;
          font-family: 'Outfit', sans-serif;
          font-size: 16px;
          font-weight: 500;
          color: var(--burgundy);
          cursor: pointer;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
        }
        .step-btn:hover:not(:disabled) { background: var(--burgundy); color: var(--cream); }
        .step-btn:disabled { color: var(--muted); opacity: 0.4; cursor: not-allowed; }
        .step-count {
          font-size: 12px;
          font-weight: 600;
          color: var(--burgundy);
          padding: 0 6px;
          font-variant-numeric: tabular-nums;
          min-width: 16px;
          text-align: center;
        }
        .step-label {
          font-size: 11px;
          color: var(--muted);
          margin-left: 2px;
        }
        .remove-btn {
          background: transparent;
          border: none;
          color: var(--muted);
          font-size: 22px;
          cursor: pointer;
          padding: 4px 10px;
          transition: color 0.2s;
          line-height: 1;
        }
        .remove-btn:hover { color: var(--danger); }

        .team-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 6px;
          padding: 22px 20px;
          position: relative;
          overflow: hidden;
        }
        .team-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--burgundy);
        }
        .team-card.gold::before { background: var(--gold); }

        /* Preference segmented control */
        .segmented {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0;
          background: var(--cream-pale);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 3px;
        }
        .seg-btn {
          background: transparent;
          border: none;
          padding: 10px 8px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.5px;
          color: var(--muted);
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
        }
        .seg-btn.active {
          background: var(--burgundy);
          color: var(--cream);
        }
        .pref-tag {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.5px;
        }

        /* Chukka schedule */
        .chukka-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 6px;
          margin-bottom: 14px;
          overflow: hidden;
        }
        .chukka-card.early { border-left: 3px solid var(--burgundy); }
        .chukka-card.late  { border-left: 3px solid var(--gold); }
        .chukka-head {
          padding: 14px 16px;
          background: var(--cream-pale);
          border-bottom: 1px solid var(--line);
          display: flex;
          align-items: baseline;
          justify-content: space-between;
        }
        .chukka-num {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 18px;
          color: var(--burgundy);
        }
        .chukka-time {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 14px;
          color: var(--ink);
        }
        .chukka-diff {
          font-size: 11px;
          color: var(--muted);
          font-style: italic;
          font-family: 'Fraunces', serif;
        }
        .chukka-body {
          padding: 14px 16px 16px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }
        .chukka-team {
          padding: 0 10px;
        }
        .chukka-team:first-child {
          border-right: 1px solid var(--line);
          padding-left: 0;
        }
        .chukka-team:last-child {
          padding-right: 0;
        }
        .team-mini-label {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 10px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .team-mini-total {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 16px;
          margin-bottom: 8px;
        }
        .team-mini-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 0;
          font-size: 13px;
          cursor: pointer;
          border-radius: 3px;
          transition: background 0.15s;
        }
        .team-mini-row:hover { background: var(--cream-pale); }
        .team-mini-row.selected {
          background: var(--cream-warm);
          outline: 1px solid var(--gold);
          padding: 5px 6px;
          margin: 0 -6px;
        }
        .team-mini-row .hcp {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 11px;
          background: var(--blue);
          color: white;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .team-mini-row.white .hcp {
          background: var(--white-team);
          color: var(--ink);
          border: 1.5px solid var(--blue);
          width: 22px;
          height: 22px;
        }
        .team-mini-name {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-weight: 500;
        }
        /* Subtle inline × on each chukka player row */
        .chukka-remove {
          background: transparent;
          border: none;
          color: var(--muted);
          font-size: 18px;
          cursor: pointer;
          padding: 0 2px 0 4px;
          line-height: 1;
          opacity: 0.35;
          transition: opacity 0.15s, color 0.15s;
          flex-shrink: 0;
        }
        .chukka-remove:hover { opacity: 1; color: var(--danger); }
        .team-mini-row.selected .chukka-remove { opacity: 1; }
        .chukka-warning {
          padding: 8px 12px;
          background: #fdf4e6;
          border-top: 1px solid #e8d5a0;
          font-size: 12px;
          color: #8a5a1a;
          font-style: italic;
          font-family: 'Fraunces', serif;
        }
        /* Inline action bar that appears when a player is tapped */
        .action-bar {
          grid-column: 1 / -1;
          padding: 10px 0 6px;
          margin-top: 8px;
          border-top: 1px dashed var(--line);
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }
        .action-label {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.5px;
          margin-right: 2px;
        }
        .action-btn {
          background: white;
          border: 1px solid var(--line);
          color: var(--burgundy);
          padding: 6px 10px;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.5px;
          cursor: pointer;
          transition: all 0.15s;
        }
        .action-btn:hover:not(:disabled) { background: var(--burgundy); color: var(--cream); border-color: var(--burgundy); }
        .action-btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .action-btn.danger { color: var(--danger); }
        .action-btn.danger:hover { background: var(--danger); color: white; border-color: var(--danger); }
        .action-btn.tiny {
          width: 26px;
          height: 26px;
          padding: 0;
          font-size: 11px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        /* Add-to-chukka strip */
        .add-strip {
          padding: 10px 16px 14px;
          background: var(--cream-pale);
          border-top: 1px dashed var(--line);
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }
        .add-trigger {
          background: transparent;
          border: 1px dashed var(--line);
          color: var(--muted);
          padding: 8px 14px;
          width: 100%;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.15s;
        }
        .add-trigger:hover { border-color: var(--burgundy); color: var(--burgundy); }
        .add-pick {
          background: white;
          border: 1px solid var(--line);
          color: var(--ink);
          padding: 6px 10px;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }
        .add-pick:hover { background: var(--burgundy); color: var(--cream); border-color: var(--burgundy); }

        .wa-card {
          background: white;
          border: 1px solid var(--line);
          border-left: 3px solid var(--wa-deep);
          border-radius: 6px;
          padding: 12px 14px;
          margin-bottom: 22px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .wa-icon {
          font-size: 16px;
          color: var(--wa-deep);
          font-weight: 600;
        }
        .wa-label {
          flex: 1;
          min-width: 0;
          font-size: 12px;
          color: var(--ink);
        }
        .wa-label .display-italic { color: var(--muted); }
        .wa-btn {
          background: var(--wa-deep);
          color: white;
          border: none;
          padding: 8px 14px;
          border-radius: 4px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          transition: background 0.15s;
        }
        .wa-btn:hover { background: var(--wa); }
        .wa-btn-outline {
          background: transparent;
          color: var(--wa-deep);
          border: 1px solid var(--wa-deep);
        }
        .wa-btn-outline:hover { background: var(--wa-deep); color: white; }
        .wa-edit-btn {
          background: none;
          border: none;
          font-size: 11px;
          color: var(--muted);
          cursor: pointer;
          letter-spacing: 0.5px;
        }
        /* Phone link in roster row */
        .phone-link {
          color: var(--wa-deep);
          font-size: 12px;
          text-decoration: none;
          letter-spacing: 0.3px;
        }
        .phone-link:hover { text-decoration: underline; }
        /* Edit hint above schedule */
        .edit-hint {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          padding: 8px 14px;
          background: var(--cream-pale);
          border: 1px dashed var(--line);
          border-radius: 4px;
          margin-bottom: 14px;
        }
        /* Autofill suggestion row */
        .suggestion-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
          padding: 2px 0;
          margin-top: -4px;
        }
        .suggestion-label {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 11px;
          color: var(--muted);
          letter-spacing: 0.3px;
          margin-right: 2px;
        }
        .suggestion-chip {
          background: var(--cream-warm);
          border: 1px solid var(--line);
          color: var(--burgundy);
          padding: 5px 11px;
          border-radius: 14px;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .suggestion-chip:hover { background: var(--burgundy); color: var(--cream); border-color: var(--burgundy); }
        .suggestion-chip .chip-hcp {
          opacity: 0.65;
          margin-left: 4px;
          font-size: 11px;
        }
        /* View toggle for cards/table */
        .view-toggle {
          display: inline-flex;
          background: var(--cream-pale);
          border: 1px solid var(--line);
          border-radius: 4px;
          padding: 3px;
          margin-bottom: 14px;
        }
        .view-toggle-btn {
          background: transparent;
          border: none;
          padding: 8px 18px;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--muted);
          cursor: pointer;
          border-radius: 3px;
          transition: all 0.2s;
        }
        .view-toggle-btn.active {
          background: var(--burgundy);
          color: var(--cream);
        }
        /* Captain-style table — breaks out of the 540px main wrapper
           so wide schedules (7-8 chukkas) get the full viewport width.
           Uses the classic "full-bleed" trick: position relative to the
           viewport rather than the parent. */
        .captain-table-wrap {
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          width: 100vw;
          max-width: 100vw;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          padding: 0 16px 8px;
          background: var(--cream-pale);
          box-sizing: border-box;
        }
        .captain-table {
          border-collapse: collapse;
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          margin: 14px auto;
          background: white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.04);
        }
        .captain-table th, .captain-table td {
          border: 1px solid var(--line);
          padding: 6px 8px;
          text-align: center;
          vertical-align: middle;
          white-space: nowrap;
        }
        .captain-table .date-cell {
          background: var(--burgundy);
          color: var(--cream);
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 12px;
          padding: 8px 10px;
          letter-spacing: 0.3px;
        }
        .captain-table .ground-cell {
          background: var(--gold-bright);
          color: var(--burgundy-deep);
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 12px;
        }
        .captain-table .time-header {
          background: var(--cream-warm);
          color: var(--burgundy);
          font-weight: 600;
          font-size: 11px;
        }
        .captain-table .col-header {
          background: var(--burgundy);
          color: var(--cream);
          font-size: 10px;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          font-weight: 500;
        }
        .captain-table .chukka-header {
          background: var(--cream-warm);
          color: var(--burgundy);
          font-size: 10px;
          letter-spacing: 0.5px;
        }
        .captain-table tbody td.name-cell {
          text-align: left;
          font-weight: 500;
          color: var(--ink);
        }
        .captain-table .blue-cell {
          background: rgba(42, 74, 110, 0.12);
          color: var(--blue-deep);
          font-weight: 700;
          font-family: 'Fraunces', serif;
        }
        .captain-table .white-cell {
          background: rgba(184, 146, 74, 0.10);
          color: var(--burgundy);
          font-weight: 700;
          font-family: 'Fraunces', serif;
        }
        .captain-table .empty-cell {
          background: white;
        }
        .captain-table tbody tr:nth-child(even) td.name-cell {
          background: var(--cream-pale);
        }

        /* Share modal */
        .share-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 22, 18, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 1000;
          animation: fadeIn 0.18s ease-out;
        }
        .share-modal {
          background: white;
          border-radius: 8px;
          max-width: 480px;
          width: 100%;
          max-height: 88vh;
          overflow-y: auto;
          box-shadow: 0 12px 32px rgba(0,0,0,0.18);
          display: flex;
          flex-direction: column;
        }
        .share-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 20px 12px;
          border-bottom: 1px solid var(--line);
        }
        .share-head h3 {
          font-family: 'Fraunces', serif;
          font-weight: 500;
          font-size: 20px;
          margin: 0;
          color: var(--burgundy);
        }
        .share-close {
          background: transparent;
          border: none;
          font-size: 24px;
          color: var(--muted);
          cursor: pointer;
          padding: 0 4px;
          line-height: 1;
        }
        .share-close:hover { color: var(--ink); }
        .share-body { padding: 14px 20px 18px; }
        .share-status {
          padding: 10px 12px;
          border-radius: 4px;
          font-size: 13px;
          margin-bottom: 12px;
        }
        .share-status.ok {
          background: rgba(37, 211, 102, 0.10);
          border-left: 3px solid var(--wa);
          color: var(--wa-deep);
        }
        .share-status.warn {
          background: #fdf4e6;
          border-left: 3px solid #b8924a;
          color: #8a5a1a;
        }
        .share-textarea {
          width: 100%;
          height: 180px;
          padding: 10px 12px;
          font-family: 'SF Mono', Menlo, Consolas, monospace;
          font-size: 11px;
          line-height: 1.5;
          background: var(--cream-pale);
          border: 1px solid var(--line);
          border-radius: 4px;
          resize: vertical;
          color: var(--ink);
          -webkit-user-select: all;
          user-select: all;
        }
        .share-textarea:focus {
          outline: none;
          border-color: var(--burgundy);
        }
        .share-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 14px;
        }
        .share-link {
          display: block;
          text-align: center;
          padding: 13px 16px;
          border-radius: 4px;
          text-decoration: none;
          font-family: 'Outfit', sans-serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .share-link.primary {
          background: var(--wa-deep);
          color: white;
        }
        .share-link.primary:hover { background: var(--wa); }
        .share-link.secondary {
          background: white;
          color: var(--burgundy);
          border: 1px solid var(--burgundy);
        }
        .share-link.secondary:hover { background: var(--burgundy); color: var(--cream); }
        .share-hint {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 12px;
          color: var(--muted);
          text-align: center;
          margin-top: 10px;
          line-height: 1.5;
        }

        .month-header {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 28px 0 14px;
        }
        .month-header:first-of-type { margin-top: 8px; }
        .month-header .line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, var(--gold), transparent);
        }

        .fixture-card {
          background: white;
          border: 1px solid var(--line);
          border-radius: 6px;
          margin-bottom: 10px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .fixture-card:hover { border-color: var(--gold); }
        .fixture-card.expanded { border-color: var(--burgundy); }
        .fixture-header {
          padding: 14px 16px;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .fixture-date {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-size: 11px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          flex-shrink: 0;
          width: 86px;
          padding-top: 2px;
          line-height: 1.35;
        }
        .fixture-name {
          font-weight: 500;
          font-size: 14px;
          color: var(--ink);
          line-height: 1.35;
        }
        .fixture-level {
          font-size: 12px;
          color: var(--burgundy);
          margin-top: 3px;
          font-weight: 400;
        }
        .fixture-meta {
          flex-shrink: 0;
          text-align: right;
          font-size: 11px;
          color: var(--muted);
          font-family: 'Fraunces', serif;
          font-style: italic;
          min-width: 50px;
        }
        .fixture-count {
          font-size: 16px;
          color: var(--burgundy);
          font-weight: 600;
          font-style: normal;
          font-family: 'Outfit', sans-serif;
          line-height: 1;
        }
        .fixture-body {
          padding: 0 16px 16px;
          border-top: 1px solid var(--line);
          background: var(--cream-pale);
        }
        .interested-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px dashed var(--line);
        }
        .interested-row:last-of-type { border-bottom: none; }
        .mini-badge {
          background: var(--burgundy);
          color: var(--cream);
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 12px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .register-form {
          margin-top: 14px;
          padding: 14px;
          background: white;
          border: 1px solid var(--line);
          border-radius: 4px;
        }

        .anim-in { animation: fadeIn 0.45s ease-out backwards; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .reveal { animation: fadeInScale 0.4s ease-out; }
      `}</style>

      <div className="polo-app">
        {/* Masthead */}
        <header
          className="header-bg"
          style={{
            paddingTop: 'calc(env(safe-area-inset-top, 0px) + 30px)',
            paddingRight: 'calc(env(safe-area-inset-right, 0px) + 20px)',
            paddingBottom: '22px',
            paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 20px)',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="display-italic" style={{ fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', opacity: 0.75, marginBottom: '4px' }}>
              Est. 1907
            </div>
            <h1 className="display" style={{ fontSize: '30px', margin: 0, lineHeight: 1.05, letterSpacing: '-0.3px' }}>
              Tedworth Park
            </h1>
            <div className="display-italic" style={{ fontSize: '20px', opacity: 0.95, marginTop: '-2px' }}>
              Polo Club
            </div>
            <div className="ornament">
              <span className="ornament-line" />
              <span className="ornament-dot" />
              <span className="ornament-line" />
            </div>
            <div className="display-italic" style={{ fontSize: '11px', opacity: 0.8, letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Home of Military Polo
            </div>
          </div>
        </header>

        {/* Tabs */}
        <nav className="tabs">
          <button className={`tab-btn ${activeTab === 'wed' ? 'active' : ''}`} onClick={() => setActiveTab('wed')}>
            Wed
          </button>
          <button className={`tab-btn ${activeTab === 'thu' ? 'active' : ''}`} onClick={() => setActiveTab('thu')}>
            Thu
          </button>
          <button className={`tab-btn ${activeTab === 'sat' ? 'active' : ''}`} onClick={() => setActiveTab('sat')}>
            Sat
          </button>
          <button className={`tab-btn ${activeTab === 'sun' ? 'active' : ''}`} onClick={() => setActiveTab('sun')}>
            Sun
          </button>
          <button className={`tab-btn ${activeTab === 'fixtures' ? 'active' : ''}`} onClick={() => setActiveTab('fixtures')}>
            Fixtures
          </button>
        </nav>

        <main style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 16px 60px' }}>

          {/* ─── DAY CHUKKAS TABS (Wed/Thu/Sat/Sun) ─── */}
          {DAY_KEYS.includes(activeTab) && (
            <div className="reveal">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="label-eyebrow">
                  {activeDayConfig.fullLabel}s · {fmtTime(throwInMin)}
                  {captainMode && !throwInEditing && (
                    <button
                      type="button"
                      onClick={() => { setThrowInInput(fmtTime(throwInMin)); setThrowInEditing(true); }}
                      style={{
                        background: 'none', border: 'none', marginLeft: '8px',
                        fontSize: '10px', color: 'var(--burgundy)',
                        cursor: 'pointer', textDecoration: 'underline',
                        textUnderlineOffset: '3px', fontFamily: 'inherit',
                        letterSpacing: '1px', textTransform: 'uppercase',
                      }}
                    >edit time</button>
                  )}
                </div>
                {captainMode && throwInEditing ? (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'center', margin: '10px 0' }}>
                    <input
                      type="time"
                      value={throwInInput}
                      onChange={(e) => setThrowInInput(e.target.value)}
                      style={{ padding: '8px 10px', border: '1px solid var(--line)', borderRadius: '4px', fontSize: '15px', fontFamily: 'inherit' }}
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        const parsed = parseTime(throwInInput);
                        if (parsed === null) return;
                        setThrowInMins(prev => ({ ...prev, [activeDay]: parsed }));
                        try { await window.storage.set(storageKey('throwin', activeDay), throwInInput, true); } catch (e) {}

                        // If a schedule already exists for this day, recompute
                        // each chukka's time using the new throw-in — teams
                        // and counts stay exactly as drawn.
                        const existing = schedules[activeDay];
                        if (existing && existing.chukkas) {
                          const updated = {
                            ...existing,
                            chukkas: existing.chukkas.map(ck => ({
                              ...ck,
                              time: chukkaTime(ck.idx, parsed),
                            })),
                          };
                          saveSchedule(updated, activeDay);
                        }

                        setThrowInEditing(false);
                      }}
                      style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', borderRadius: '4px', padding: '8px 14px', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer' }}
                    >Save</button>
                    <button
                      type="button"
                      onClick={() => { setThrowInEditing(false); setThrowInInput(''); }}
                      style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                    >cancel</button>
                  </div>
                ) : null}
                <h2 className="display" style={{ margin: '2px 0 0', fontSize: '24px' }}>Club Chukka Booking</h2>
                <div style={{ fontSize: '12px', color: 'var(--muted)', marginTop: '4px' }}>
                  {players.length} {players.length === 1 ? 'rider' : 'riders'} · {totalChukkas} chukkas booked
                </div>
              </div>

              {/* WhatsApp group card — only shown when link is set OR captain is editing */}
              {(waLink || captainMode) && (
                <div className="wa-card">
                  <span className="wa-icon">💬</span>
                  <div className="wa-label">
                    {waLink ? (
                      <>
                        <strong>Club WhatsApp</strong>
                        <div className="display-italic">Tap to join the group chat</div>
                      </>
                    ) : (
                      <>
                        <strong>WhatsApp group</strong>
                        <div className="display-italic">Add the club's group link to publish team sheets</div>
                      </>
                    )}
                  </div>
                  {waEditing && captainMode ? (
                    <div style={{ flexBasis: '100%', display: 'flex', gap: '6px', marginTop: '6px' }}>
                      <input
                        className="input-field"
                        type="url"
                        placeholder="https://chat.whatsapp.com/..."
                        value={waInput}
                        onChange={(e) => setWaInput(e.target.value)}
                        style={{ padding: '8px 12px', fontSize: '13px' }}
                      />
                      <button className="wa-btn" onClick={() => saveWaLink(waInput)}>Save</button>
                      <button className="wa-edit-btn" onClick={() => { setWaEditing(false); setWaInput(''); }}>cancel</button>
                    </div>
                  ) : waLink ? (
                    <>
                      <a className="wa-btn" href={waLink} target="_blank" rel="noopener noreferrer">Join group</a>
                      {captainMode && (
                        <>
                          <button
                            className="wa-edit-btn"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(waLink);
                                window.alert('Group link copied to clipboard.');
                              } catch (e) {
                                window.prompt('Copy this link:', waLink);
                              }
                            }}
                          >copy</button>
                          <button className="wa-edit-btn" onClick={() => { setWaInput(waLink); setWaEditing(true); }}>edit</button>
                        </>
                      )}
                    </>
                  ) : captainMode ? (
                    <button className="wa-btn wa-btn-outline" onClick={() => { setWaInput(''); setWaEditing(true); }}>
                      Set link
                    </button>
                  ) : null}
                </div>
              )}

              {/* Sign-up */}
              <section className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                <div className="label-eyebrow" style={{ marginBottom: '2px' }}>Sign up</div>
                <h2 className="display" style={{ margin: '0 0 16px', fontSize: '22px' }}>Add a Player</h2>

                {/* Booking cutoff banner — public only, within the closed window for this day */}
                {!captainMode && isBookingClosed() && (
                  <div
                    role="alert"
                    style={{
                      background: '#fef0ee',
                      border: '1px solid #d27a6f',
                      borderLeft: '4px solid var(--burgundy)',
                      borderRadius: '4px',
                      padding: '14px 16px',
                      marginBottom: '16px',
                      fontSize: '13px',
                      lineHeight: 1.55,
                    }}
                  >
                    <div style={{ fontWeight: 600, color: 'var(--burgundy)', marginBottom: '6px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>
                      Bookings closed for this {activeDayConfig.fullLabel}
                    </div>
                    <div style={{ color: 'var(--ink)' }}>
                      {bookingClosedReason()} To be added, please email the captain:
                    </div>
                    <a
                      href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(activeDayConfig.fullLabel + ' Chukkas - late sign-up')}`}
                      style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        color: 'var(--burgundy)',
                        fontWeight: 500,
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                  {suggestions.length > 0 && (
                    <div className="suggestion-row">
                      <span className="suggestion-label">
                        {nameInputLower ? 'Did you mean:' : 'Quick add:'}
                      </span>
                      {suggestions.map(s => (
                        <button
                          key={s.name}
                          type="button"
                          className="suggestion-chip"
                          onClick={() => fillFromMember(s)}
                        >
                          {s.name}<span className="chip-hcp">{fmtH(s.handicap)}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  <input
                    className="input-field"
                    type="tel"
                    placeholder="Mobile (optional)"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Handicap</label>
                      <select
                        className="input-field select-field"
                        value={handicap}
                        onChange={(e) => setHandicap(e.target.value)}
                      >
                        <option value="">Select…</option>
                        {HANDICAP_OPTIONS.map(h => (
                          <option key={h} value={h}>{fmtH(h)}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Chukkas</label>
                      <input
                        className="input-field"
                        type="number"
                        placeholder="e.g. 3"
                        min="1"
                        max="8"
                        value={chukkas}
                        onChange={(e) => setChukkas(e.target.value)}
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Available from</label>
                    <select
                      className="input-field select-field"
                      value={availableFrom || fmtTime(throwInMin)}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      aria-label="Earliest chukka you can play"
                    >
                      {(captainMode ? [0,1,2,3,4,5,6,7] : [0,1,2,3]).map(i => {
                        const t = fmtTime(throwInMin + i * CHUKKA_INTERVAL_MIN);
                        return (
                          <option key={t} value={t}>
                            {t}{i === 0 ? ' (throw-in)' : ''}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      Pick the earliest chukka you can be on the field. If fewer chukkas are available from then, your chukka count is reduced.
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: 'var(--muted)', display: 'block', marginBottom: '6px', letterSpacing: '1px', textTransform: 'uppercase' }}>Available to</label>
                    <select
                      className="input-field select-field"
                      value={availableTo}
                      onChange={(e) => setAvailableTo(e.target.value)}
                      aria-label="Latest chukka you can play"
                    >
                      <option value="">Stay until the end</option>
                      {(captainMode ? [0,1,2,3,4,5,6,7] : [4,5,6,7]).map(i => {
                        const t = fmtTime(throwInMin + i * CHUKKA_INTERVAL_MIN);
                        return (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        );
                      })}
                    </select>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', lineHeight: 1.4 }}>
                      Pick the latest chukka you can stay for. Leave as "Stay until the end" if you've got no other plans.
                    </div>
                  </div>

                  {error && (
                    <div style={{ fontSize: '13px', color: 'var(--danger)', padding: '10px 14px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)' }}>
                      {error}
                    </div>
                  )}

                  <button
                    className="btn-primary"
                    onClick={handleAdd}
                    disabled={!captainMode && isBookingClosed()}
                    style={!captainMode && isBookingClosed() ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
                  >
                    {(!captainMode && isBookingClosed()) ? 'Bookings closed · email captain' : 'Add to Roster'}
                  </button>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '4px', lineHeight: 1.45 }}>
                    By signing up, you agree to your name, handicap and (if given) mobile number being used to organise the Wednesday chukkas.{' '}
                    <button
                      type="button"
                      onClick={() => setPrivacyOpen(true)}
                      style={{ background: 'none', border: 'none', padding: 0, color: 'var(--burgundy, #6b1f2a)', cursor: 'pointer', textDecoration: 'underline', fontSize: '11px', fontFamily: 'inherit' }}
                    >
                      Privacy notice
                    </button>
                  </div>
                </div>
              </section>

              {/* Roster */}
              {players.length > 0 && (
                <section style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div>
                      <div className="label-eyebrow">{activeDayConfig.fullLabel}'s field</div>
                      <h2 className="display" style={{ margin: '2px 0 0', fontSize: '22px' }}>Roster</h2>
                    </div>
                    {captainMode && (
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <button onClick={sortByChukkas} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          sort ↓ chukkas
                        </button>
                        <button onClick={() => loadExample('may20')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          load 20 May
                        </button>
                        <button onClick={() => loadExample('may13')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          load 13 May
                        </button>
                        <button onClick={() => loadExample('may6')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          load 6 May
                        </button>
                        <button onClick={() => loadExample('apr29')} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          load 29 Apr
                        </button>
                        <button onClick={clearAll} style={{ background: 'none', border: 'none', fontSize: '11px', color: 'var(--muted)', cursor: 'pointer' }}>
                          clear
                        </button>
                      </div>
                    )}
                  </div>

                  {players.map((p, i) => {
                    // Build the availability label shown beneath the name.
                    const fromMin = p.availableFrom ? parseTime(p.availableFrom) : null;
                    const toMin = p.availableTo ? parseTime(p.availableTo) : null;
                    const isLateArriver = fromMin !== null && fromMin > throwInMin;
                    const hasEarlyFinish = toMin !== null && toMin !== undefined && p.availableTo !== '';
                    let availLabel = null;
                    if (isLateArriver && hasEarlyFinish) {
                      availLabel = `${p.availableFrom}–${p.availableTo}`;
                    } else if (isLateArriver) {
                      availLabel = `from ${p.availableFrom}`;
                    } else if (hasEarlyFinish) {
                      availLabel = `until ${p.availableTo}`;
                    }
                    const isEditingAvail = captainMode && editingAvailId === p.id;
                    return (
                      <div key={p.id} className="anim-in" style={{ animationDelay: `${i * 0.04}s`, borderBottom: '1px solid var(--line)' }}>
                        <div className="player-row" style={{ borderBottom: 'none' }}>
                          {/* Reorder handles — captain only */}
                          {captainMode && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', marginRight: '4px', flexShrink: 0 }}>
                              <button
                                onClick={() => movePlayer(p.id, -1)}
                                disabled={i === 0}
                                aria-label="Move up"
                                style={{ background: 'none', border: 'none', cursor: i === 0 ? 'default' : 'pointer', color: i === 0 ? 'var(--line)' : 'var(--muted)', fontSize: '13px', padding: '1px 4px', lineHeight: 1 }}
                              >▲</button>
                              <button
                                onClick={() => movePlayer(p.id, 1)}
                                disabled={i === players.length - 1}
                                aria-label="Move down"
                                style={{ background: 'none', border: 'none', cursor: i === players.length - 1 ? 'default' : 'pointer', color: i === players.length - 1 ? 'var(--line)' : 'var(--muted)', fontSize: '13px', padding: '1px 4px', lineHeight: 1 }}
                              >▼</button>
                            </div>
                          )}
                          <div className="handicap-badge">{fmtH(p.handicap)}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 500, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              {availLabel && <span className="pref-tag">{availLabel}</span>}
                              {captainMode && (
                                <button
                                  onClick={() => setEditingAvailId(isEditingAvail ? null : p.id)}
                                  aria-label={isEditingAvail ? 'Close availability editor' : 'Edit availability window'}
                                  style={{ background: 'none', border: 'none', padding: '0 2px', cursor: 'pointer', fontSize: '11px', color: isEditingAvail ? 'var(--burgundy)' : 'var(--muted)', lineHeight: 1 }}
                                >⏱</button>
                              )}
                              {p.mobile && captainMode && (
                                <>
                                  {(availLabel || true) && <span style={{ margin: '0 2px' }}>·</span>}
                                  <a href={`tel:${p.mobile.replace(/\s+/g, '')}`} className="phone-link" onClick={(e) => e.stopPropagation()}>
                                    {p.mobile}
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                          {captainMode ? (
                            <>
                              <div className="chukka-stepper" aria-label="Chukkas">
                                <button
                                  className="step-btn"
                                  onClick={() => adjustChukkas(p.id, -1)}
                                  disabled={p.chukkas <= 1}
                                  aria-label="Decrease chukkas"
                                >−</button>
                                <span className="step-count">{p.chukkas}</span>
                                <button
                                  className="step-btn"
                                  onClick={() => adjustChukkas(p.id, +1)}
                                  disabled={p.chukkas >= 8}
                                  aria-label="Increase chukkas"
                                >+</button>
                              </div>
                              <button className="remove-btn" onClick={() => { removePlayer(p.id); setEditingAvailId(null); }} aria-label={`Remove ${p.name}`}>×</button>
                            </>
                          ) : (
                            <div style={{ fontSize: '13px', color: 'var(--muted)', padding: '6px 10px', minWidth: '60px', textAlign: 'right' }}>
                              <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{p.chukkas}</span>
                              <span style={{ marginLeft: '4px' }}>chukka{p.chukkas === 1 ? '' : 's'}</span>
                            </div>
                          )}
                        </div>
                        {/* Inline availability editor — captain only, shown when ⏱ is tapped */}
                        {isEditingAvail && (
                          <div style={{ padding: '10px 14px 14px', background: 'var(--cream-pale)', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div style={{ flex: '1 1 120px' }}>
                              <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Available from</label>
                              <select
                                className="input-field select-field"
                                style={{ fontSize: '13px', padding: '6px 8px' }}
                                value={p.availableFrom || fmtTime(throwInMin)}
                                onChange={(e) => updateAvail(p.id, 'availableFrom', e.target.value)}
                              >
                                {[0, 1, 2, 3, 4, 5, 6, 7].map(j => {
                                  const t = fmtTime(throwInMin + j * CHUKKA_INTERVAL_MIN);
                                  return <option key={t} value={t}>{t}{j === 0 ? ' (throw-in)' : ''}</option>;
                                })}
                              </select>
                            </div>
                            <div style={{ flex: '1 1 120px' }}>
                              <label style={{ fontSize: '10px', color: 'var(--muted)', display: 'block', marginBottom: '4px', letterSpacing: '1px', textTransform: 'uppercase' }}>Available to</label>
                              <select
                                className="input-field select-field"
                                style={{ fontSize: '13px', padding: '6px 8px' }}
                                value={p.availableTo || ''}
                                onChange={(e) => updateAvail(p.id, 'availableTo', e.target.value)}
                              >
                                <option value="">Until the end</option>
                                {[0, 1, 2, 3, 4, 5, 6, 7].map(j => {
                                  const t = fmtTime(throwInMin + j * CHUKKA_INTERVAL_MIN);
                                  return <option key={t} value={t}>{t}</option>;
                                })}
                              </select>
                            </div>
                            <button
                              onClick={() => setEditingAvailId(null)}
                              style={{ background: 'var(--burgundy)', color: '#fff', border: 'none', borderRadius: '4px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
                            >Done</button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {captainMode && (
                    <>
                      <button className="btn-primary" onClick={generate} disabled={players.length < 4} style={{ marginTop: '16px' }}>
                        {players.length < 4 ? 'Need 4+ Players' : 'Draw Schedule & Teams'}
                      </button>

                  <button
                    onClick={clearAll}
                    style={{
                      marginTop: '10px',
                      width: '100%',
                      background: 'transparent',
                      border: '1px solid rgba(107, 31, 42, 0.25)',
                      color: '#6b1f2a',
                      padding: '10px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 500,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(107, 31, 42, 0.06)'; e.currentTarget.style.borderColor = 'rgba(107, 31, 42, 0.45)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(107, 31, 42, 0.25)'; }}
                  >
                    Clear roster · start again
                  </button>
                    </>
                  )}
                </section>
              )}

              {/* Schedule */}
              {schedule && (
                <section ref={scheduleRef} className="reveal" style={{ marginTop: '36px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <h2 className="display" style={{ margin: '4px 0', fontSize: '26px' }}>{activeDayConfig.fullLabel} Chukkas</h2>
                    <div className="ornament">
                      <span className="ornament-line" />
                      <span className="ornament-dot" />
                      <span className="ornament-line" />
                    </div>
                    <div style={{ fontSize: '13px', color: 'var(--muted)' }}>
                      <span className="display-italic">{schedule.numChukkas} chukkas</span>
                      {' · '}
                      {chukkaTime(0, throwInMin)} — {chukkaTime(schedule.numChukkas - 1, throwInMin)}
                      {' · '}
                      {schedule.totalSlots} player-slots
                    </div>
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <div className="view-toggle" role="tablist" aria-label="Schedule view">
                      <button
                        className={`view-toggle-btn ${scheduleView === 'cards' ? 'active' : ''}`}
                        onClick={() => setScheduleView('cards')}
                        role="tab"
                        aria-selected={scheduleView === 'cards'}
                      >
                        Cards
                      </button>
                      <button
                        className={`view-toggle-btn ${scheduleView === 'table' ? 'active' : ''}`}
                        onClick={() => setScheduleView('table')}
                        role="tab"
                        aria-selected={scheduleView === 'table'}
                      >
                        Table
                      </button>
                    </div>
                  </div>

                  {scheduleView === 'cards' && captainMode && (
                    <div className="edit-hint">
                      Tap × to remove a player from a chukka. Tap a name to swap teams or move them.
                    </div>
                  )}

                  {schedule.reduced && schedule.reduced.length > 0 && (
                    <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#fdf4e6', border: '1px solid #e8d5a0', borderRadius: '4px', fontSize: '13px', color: '#8a5a1a' }}>
                      <strong>Reduced for fairness:</strong>{' '}
                      {schedule.reduced.map(r => `${r.player.name} (wanted ${r.requested}, playing ${r.given})`).join(', ')}
                      <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85 }} className="display-italic">
                        Late signups give way to players who booked earlier — teams stay max 4 a side.
                      </div>
                    </div>
                  )}

                  {schedule.capped && schedule.capped.length > 0 && (
                    <div style={{ marginBottom: '14px', padding: '12px 14px', background: '#fdf4e6', border: '1px solid #e8d5a0', borderRadius: '4px', fontSize: '13px', color: '#8a5a1a' }}>
                      <strong>Capped at {schedule.numChukkas}:</strong>{' '}
                      {schedule.capped.map(u => `${u.player.name} (wanted ${u.requested})`).join(', ')}
                      <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85 }} className="display-italic">
                        Requested more chukkas than the evening has — playing all available.
                      </div>
                    </div>
                  )}

                  {scheduleView === 'cards' && schedule.chukkas.map((ck, idx) => {
                    const diff = Math.abs(ck.sumA - ck.sumB);
                    const teamAFour = ck.teamA.length;
                    const teamBFour = ck.teamB.length;
                    const tooFew = ck.playerCount < 4;

                    const renderPlayer = (p, teamClass) => {
                      const isActive = activePlayer && activePlayer.chukkaIdx === idx && activePlayer.playerId === p.id;
                      const onClick = captainMode
                        ? (e) => {
                            e.stopPropagation();
                            setActivePlayer(isActive ? null : { chukkaIdx: idx, playerId: p.id });
                            setAddingTo(null);
                          }
                        : undefined;
                      return (
                        <div
                          key={p.id}
                          className={`team-mini-row ${teamClass} ${isActive ? 'selected' : ''}`}
                          onClick={onClick}
                          style={captainMode ? undefined : { cursor: 'default' }}
                        >
                          <span className="hcp">{fmtH(p.handicap)}</span>
                          <span className="team-mini-name">{p.name}</span>
                          {captainMode && (
                            <button
                              className="chukka-remove"
                              onClick={(e) => { e.stopPropagation(); removeFromChukka(idx, p.id); }}
                              aria-label={`Remove ${p.name} from chukka ${ck.number}`}
                              title="Remove from this chukka"
                            >×</button>
                          )}
                        </div>
                      );
                    };

                    const isActionOpenHere = activePlayer && activePlayer.chukkaIdx === idx;
                    const activeP = isActionOpenHere
                      ? [...ck.teamA, ...ck.teamB].find(p => p.id === activePlayer.playerId)
                      : null;

                    const playerIdsInChukka = new Set([...ck.teamA, ...ck.teamB].map(p => p.id));
                    const availableToAdd = players.filter(p => !playerIdsInChukka.has(p.id));

                    return (
                      <div key={ck.idx} className={`chukka-card anim-in ${ck.isEarly ? 'early' : 'late'}`} style={{ animationDelay: `${idx * 0.06}s` }}>
                        <div className="chukka-head">
                          <div>
                            <div className="chukka-num">Chukka {ck.number}</div>
                            <div className="chukka-time">{ck.time}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div className="chukka-diff">
                              {ck.playerCount === 0 ? 'no players' : `${teamAFour}v${teamBFour} · Δ${diff}`}
                            </div>
                          </div>
                        </div>
                        {ck.playerCount > 0 ? (
                          <div className="chukka-body">
                            <div className="chukka-team">
                              <div className="team-mini-label">Blue</div>
                              <div className="team-mini-total" style={{ color: 'var(--blue)' }}>HCP {ck.sumA}</div>
                              {ck.teamA.map(p => renderPlayer(p, ''))}
                            </div>
                            <div className="chukka-team">
                              <div className="team-mini-label">White</div>
                              <div className="team-mini-total" style={{ color: 'var(--muted)' }}>HCP {ck.sumB}</div>
                              {ck.teamB.map(p => renderPlayer(p, 'white'))}
                            </div>

                            {activeP && captainMode && (
                              <div className="action-bar">
                                <span className="action-label">{activeP.name}:</span>
                                <button
                                  className="action-btn"
                                  onClick={() => swapPlayerTeam(idx, activeP.id)}
                                >Swap team</button>
                                <button
                                  className="action-btn danger"
                                  onClick={() => removeFromChukka(idx, activeP.id)}
                                >Remove</button>
                                <span style={{ flexBasis: '100%', height: 0 }} />
                                <span className="action-label">Move to →</span>
                                {schedule.chukkas.map((_, otherIdx) => (
                                  <button
                                    key={otherIdx}
                                    className="action-btn tiny"
                                    disabled={otherIdx === idx}
                                    onClick={() => movePlayerToChukka(idx, activeP.id, otherIdx)}
                                  >{otherIdx + 1}</button>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div style={{ padding: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }} className="display-italic">
                            No players assigned to this chukka.
                          </div>
                        )}

                        {tooFew && ck.playerCount > 0 && (
                          <div className="chukka-warning">
                            {ck.playerCount} player{ck.playerCount === 1 ? '' : 's'} — short of a full chukka, but plays as {teamAFour}v{teamBFour}.
                          </div>
                        )}

                        {/* Add player to chukka — captain only */}
                        {captainMode && availableToAdd.length > 0 && (
                          <div className="add-strip">
                            {addingTo === idx ? (
                              <>
                                <span className="action-label">Add to chukka {ck.number}:</span>
                                {availableToAdd.map(p => (
                                  <button
                                    key={p.id}
                                    className="add-pick"
                                    onClick={() => addToChukka(idx, p.id)}
                                  >
                                    {p.name} ({fmtH(p.handicap)})
                                  </button>
                                ))}
                                <button
                                  className="action-btn"
                                  onClick={() => setAddingTo(null)}
                                >Cancel</button>
                              </>
                            ) : (
                              <button
                                className="add-trigger"
                                onClick={() => { setAddingTo(idx); setActivePlayer(null); }}
                              >+ Add player to chukka {ck.number}</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {scheduleView === 'table' && (() => {
                    const dateStr = getDateStr();
                    const sortedPlayers = [...players].sort((a, b) => b.handicap - a.handicap);
                    return (
                      <div className="captain-table-wrap">
                        <table className="captain-table">
                          <thead>
                            <tr>
                              <th colSpan={3} className="date-cell">{dateStr}</th>
                              {schedule.chukkas.map(ck => (
                                <th key={ck.idx} className="time-header">{ck.time}</th>
                              ))}
                            </tr>
                            <tr>
                              <th className="col-header">Name</th>
                              <th className="col-header">HCP</th>
                              <th className="col-header">C</th>
                              {schedule.chukkas.map(ck => (
                                <th key={ck.idx} className="chukka-header">Chukka {ck.number}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {sortedPlayers.map(p => (
                              <tr key={p.id}>
                                <td className="name-cell">{p.name}</td>
                                <td>{fmtH(p.handicap)}</td>
                                <td>{p.chukkas}</td>
                                {schedule.chukkas.map(ck => {
                                  const inA = ck.teamA.find(x => x.id === p.id);
                                  const inB = ck.teamB.find(x => x.id === p.id);
                                  const cls = inA ? 'blue-cell' : inB ? 'white-cell' : 'empty-cell';
                                  return (
                                    <td key={ck.idx} className={cls}>
                                      {inA ? 'B' : inB ? 'W' : ''}
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3} style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', padding: '6px 8px', textAlign: 'right', borderTop: '2px solid var(--line)' }}>Players</td>
                              {schedule.chukkas.map(ck => (
                                <td key={ck.idx} style={{ textAlign: 'center', fontWeight: 600, fontSize: '12px', color: 'var(--ink)', padding: '6px 4px', borderTop: '2px solid var(--line)', whiteSpace: 'nowrap' }}>
                                  {ck.teamA.length} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>vs</span> {ck.teamB.length}
                                </td>
                              ))}
                            </tr>
                          </tfoot>
                        </table>
                        <div style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', marginTop: '4px', paddingBottom: '8px' }} className="display-italic">
                          B = Blue · W = White · Scroll sideways to see all chukkas
                        </div>
                      </div>
                    );
                  })()}

                  {captainMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
                      <button className="wa-btn" onClick={publishToWhatsApp} style={{ padding: '14px', fontSize: '12px', width: '100%' }}>
                        📣 Share team sheet
                      </button>
                      <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)' }} className="display-italic">
                        Pick <strong style={{ fontStyle: 'normal' }}>WhatsApp</strong> (not WhatsApp Business) from your share sheet, then choose the club group.
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '4px' }}>
                        <button className="btn-secondary" onClick={exportXLSX} style={{ width: '100%' }}>
                          📊 Export Excel
                        </button>
                        <button className="btn-secondary" onClick={exportPNG} style={{ width: '100%' }}>
                          🖼 Export PNG
                        </button>
                      </div>
                      <button className="btn-secondary" onClick={generate} style={{ width: '100%' }}>
                        Redraw schedule
                      </button>
                    </div>
                  )}
                </section>
              )}

              {loaded && players.length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px 20px 12px', color: 'var(--muted)' }}>
                  <div className="display-italic" style={{ fontSize: '20px', color: 'var(--ink)', marginBottom: '4px' }}>The field awaits.</div>
                  <div style={{ fontSize: '13px', marginBottom: '18px' }}>
                    {captainMode ? "Add the first rider to begin the Wednesday draw." : "Be the first to sign up for this Wednesday's chukkas."}
                  </div>
                  {captainMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'stretch', maxWidth: '320px', margin: '0 auto' }}>
                      {Object.entries(EXAMPLES).map(([key, ex]) => (
                        <button
                          key={key}
                          onClick={() => loadExample(key)}
                          style={{
                            background: 'transparent',
                            border: '1px solid var(--gold)',
                            color: 'var(--burgundy)',
                            padding: '10px 16px',
                            borderRadius: '4px',
                            fontFamily: "'Outfit', sans-serif",
                            fontSize: '11px',
                            fontWeight: 500,
                            letterSpacing: '1.2px',
                            textTransform: 'uppercase',
                            cursor: 'pointer'
                          }}
                        >
                          Load · {ex.label} <span style={{ opacity: 0.65, textTransform: 'none', letterSpacing: 0, fontStyle: 'italic' }}>({ex.note})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── FIXTURES TAB ─── */}
          {activeTab === 'fixtures' && (
            <div className="reveal">
              <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                <div className="label-eyebrow">Grass Season</div>
                <h2 className="display" style={{ margin: '2px 0 0', fontSize: '26px' }}>Fixtures 2026</h2>
                <div className="ornament">
                  <span className="ornament-line" />
                  <span className="ornament-dot" />
                  <span className="ornament-line" />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--muted)', maxWidth: '400px', margin: '0 auto', lineHeight: 1.5 }}>
                  Tap a fixture to register your interest and see who else has signed up.
                </div>
                {totalRegistrations > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--burgundy)', marginTop: '8px', fontWeight: 500 }}>
                    {totalRegistrations} {totalRegistrations === 1 ? 'registration' : 'registrations'} across the season
                  </div>
                )}
              </div>

              {MONTHS_ORDER.map(month => {
                const monthFixtures = FIXTURES_2026.filter(f => f.month === month);
                if (monthFixtures.length === 0) return null;
                return (
                  <div key={month}>
                    <div className="month-header">
                      <span className="line" />
                      <span className="display" style={{ fontSize: '18px', color: 'var(--burgundy)' }}>{month}</span>
                      <span className="line" style={{ transform: 'scaleX(-1)' }} />
                    </div>

                    {monthFixtures.map((fx) => {
                      const registered = interest[fx.id] || [];
                      const isExpanded = expandedId === fx.id;
                      return (
                        <div key={fx.id} className={`fixture-card ${isExpanded ? 'expanded' : ''}`}>
                          <div className="fixture-header" onClick={() => toggleFixture(fx.id)}>
                            <div className="fixture-date">{fx.date}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="fixture-name">{fx.name}</div>
                              {fx.level && <div className="fixture-level">{fx.level}</div>}
                            </div>
                            <div className="fixture-meta">
                              {registered.length > 0 ? (
                                <>
                                  <div className="fixture-count">{registered.length}</div>
                                  <div>signed up</div>
                                </>
                              ) : (
                                <div style={{ fontSize: '20px', color: 'var(--muted)', lineHeight: 1 }}>{isExpanded ? '−' : '+'}</div>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="fixture-body reveal">
                              {registered.length > 0 ? (
                                <div style={{ paddingTop: '10px' }}>
                                  <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '4px' }}>Registered Interest</div>
                                  {registered.map(p => (
                                    <div key={p.id} className="interested-row">
                                      <div className="mini-badge">{fmtH(p.handicap)}</div>
                                      <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontWeight: 500, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                                        {captainMode && (p.mobile || p.email) && (
                                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', display: 'flex', flexWrap: 'wrap', gap: '4px 10px' }}>
                                            {p.mobile && (
                                              <a href={`tel:${p.mobile.replace(/\s+/g, '')}`} className="phone-link" onClick={(e) => e.stopPropagation()}>
                                                {p.mobile}
                                              </a>
                                            )}
                                            {p.email && (
                                              <a href={`mailto:${p.email}`} className="phone-link" onClick={(e) => e.stopPropagation()} style={{ textTransform: 'none', letterSpacing: 0 }}>
                                                {p.email}
                                              </a>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      {captainMode && (
                                        <button className="remove-btn" onClick={() => removeInterest(fx.id, p.id)} aria-label={`Remove ${p.name}`} style={{ fontSize: '18px' }}>×</button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ paddingTop: '14px', textAlign: 'center', fontSize: '13px', color: 'var(--muted)' }} className="display-italic">
                                  Be the first to register.
                                </div>
                              )}

                              <div className="register-form">
                                <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '10px' }}>Register your interest</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                  <input
                                    className="input-field"
                                    type="text"
                                    placeholder="Your name"
                                    value={fName}
                                    onChange={(e) => setFName(e.target.value)}
                                    style={{ padding: '12px 14px', fontSize: '15px' }}
                                  />
                                  <select
                                    className="input-field select-field"
                                    value={fHandicap}
                                    onChange={(e) => setFHandicap(e.target.value)}
                                    style={{ padding: '12px 14px', fontSize: '15px' }}
                                  >
                                    <option value="">Select your handicap…</option>
                                    {HANDICAP_OPTIONS.map(h => (
                                      <option key={h} value={h}>{fmtH(h)}</option>
                                    ))}
                                  </select>
                                  <input
                                    className="input-field"
                                    type="tel"
                                    placeholder="Mobile (optional, captain only)"
                                    value={fMobile}
                                    onChange={(e) => setFMobile(e.target.value)}
                                    style={{ padding: '12px 14px', fontSize: '15px' }}
                                  />
                                  <input
                                    className="input-field"
                                    type="email"
                                    placeholder="Email (optional, captain only)"
                                    value={fEmail}
                                    onChange={(e) => setFEmail(e.target.value)}
                                    style={{ padding: '12px 14px', fontSize: '15px' }}
                                  />
                                  <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.45, marginTop: '-2px' }}>
                                    Your name and handicap will be visible to other members. Mobile and email are visible only to the Captain — used for fixture coordination.
                                  </div>
                                  {fError && (
                                    <div style={{ fontSize: '12px', color: 'var(--danger)', padding: '8px 12px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)' }}>
                                      {fError}
                                    </div>
                                  )}
                                  <button className="btn-primary" onClick={() => registerInterest(fx.id)} style={{ padding: '13px', fontSize: '12px' }}>
                                    Register Interest
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}

              <div style={{ textAlign: 'center', marginTop: '28px', padding: '18px 0 4px', borderTop: '1px solid var(--line)' }}>
                <div className="display-italic" style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '10px' }}>
                  Source: official 2026 fixture list
                </div>
                <a
                  href="https://tedworthparkpolo.com/grass-fixture-list-2026/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '11px', color: 'var(--burgundy)', letterSpacing: '1.5px', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid var(--gold)', paddingBottom: '2px' }}
                >
                  View on tedworthparkpolo.com ↗
                </a>
              </div>
            </div>
          )}

        </main>

        <footer style={{ textAlign: 'center', padding: '22px 20px', borderTop: '1px solid var(--line)', fontSize: '10px', color: 'var(--muted)', letterSpacing: '2px', textTransform: 'uppercase', background: 'var(--cream-warm)' }}>
          <div>Tedworth Park Polo Club · Tidworth, Wiltshire</div>
          <div style={{ marginTop: '4px', fontSize: '9px', opacity: 0.7 }}>© ACT Systems Ltd. 2026</div>
          <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setPrivacyOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: 0,
                opacity: 0.7,
              }}
            >
              Privacy
            </button>
            <span style={{ opacity: 0.3 }}>·</span>
            {captainMode ? (
              <>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--burgundy)', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--burgundy)', display: 'inline-block' }} />
                  Captain mode
                </span>
                <button
                  onClick={lockCaptainMode}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    fontSize: '10px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                  }}
                >
                  Lock
                </button>
              </>
            ) : (
              <button
                onClick={openPinModal}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--muted)',
                  fontSize: '10px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  padding: 0,
                  opacity: 0.6,
                }}
              >
                captain
              </button>
            )}
          </div>
        </footer>

        {/* Floating refresh button — fixed bottom-right, respects iPhone safe area */}
        <button
          onClick={hardRefresh}
          disabled={refreshing}
          aria-label={refreshing ? 'Refreshing…' : 'Refresh app'}
          title="Refresh"
          style={{
            position: 'fixed',
            bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
            right: 'calc(env(safe-area-inset-right, 0px) + 16px)',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1px solid rgba(107, 31, 42, 0.6)',
            color: 'var(--burgundy, #6b1f2a)',
            fontSize: '20px',
            fontWeight: 600,
            lineHeight: 1,
            cursor: refreshing ? 'progress' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.18)',
            WebkitTapHighlightColor: 'transparent',
            touchAction: 'manipulation',
            zIndex: 90,
          }}
        >
          <span
            style={{
              display: 'inline-block',
              transformOrigin: 'center',
              animation: refreshing ? 'spin 0.7s linear infinite' : 'none',
            }}
          >
            ↻
          </span>
        </button>

        {/* PIN modal — captain access */}
        {pinModalOpen && (
          <div className="share-backdrop" onClick={() => setPinModalOpen(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '340px' }}>
              <div className="share-head">
                <h3>Captain access</h3>
                <button className="share-close" onClick={() => setPinModalOpen(false)} aria-label="Close">×</button>
              </div>
              <div className="share-body">
                <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'var(--muted)', lineHeight: 1.55, textAlign: 'center' }}>
                  Enter the 4-digit captain PIN to unlock team management.
                </p>
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4)); setPinError(''); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' && pinInput.length === 4) submitPin(); }}
                  autoFocus
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '32px',
                    letterSpacing: '14px',
                    padding: '14px 0 14px 14px',
                    border: '1px solid var(--line)',
                    borderRadius: '4px',
                    fontFamily: "'Outfit', sans-serif",
                    color: 'var(--ink)',
                    background: '#fff',
                    boxSizing: 'border-box',
                  }}
                />
                {pinError && (
                  <div style={{ color: 'var(--danger)', fontSize: '13px', marginTop: '10px', textAlign: 'center' }}>
                    {pinError}
                  </div>
                )}
                <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
                  <button className="btn-secondary" onClick={() => setPinModalOpen(false)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button
                    onClick={submitPin}
                    disabled={pinInput.length !== 4}
                    style={{
                      flex: 1,
                      background: pinInput.length === 4 ? '#6b1f2a' : '#bbb',
                      color: '#f4ecd8',
                      border: 'none',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: pinInput.length === 4 ? 'pointer' : 'not-allowed',
                    }}
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy notice modal */}
        {privacyOpen && (
          <div className="share-backdrop" onClick={() => setPrivacyOpen(false)}>
            <div
              className="share-modal"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '520px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
            >
              <div className="share-head">
                <h3>Privacy notice</h3>
                <button className="share-close" onClick={() => setPrivacyOpen(false)} aria-label="Close">×</button>
              </div>
              <div
                className="share-body"
                style={{
                  overflowY: 'auto',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: 'var(--ink)',
                  textAlign: 'left',
                  paddingRight: '4px',
                }}
              >
                <p style={{ marginTop: 0, fontSize: '11px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                  Last updated: May 2026
                </p>
                <p>
                  This notice explains how the Committee of Tedworth Park Polo Club handles your personal information when you use this Wednesday Chukkas booking page. We aim to comply with UK GDPR and the Data Protection Act 2018.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Who we are</h4>
                <p style={{ marginTop: 0 }}>
                  The Committee of Tedworth Park Polo Club, Tidworth, Wiltshire is the data controller for the information you provide via this page. For any privacy queries — including requests to access, correct or delete your data — contact the Club Captain.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>What we collect</h4>
                <ul style={{ marginTop: 0, paddingLeft: '18px' }}>
                  <li>Your name (when you sign up to play or register interest in a fixture)</li>
                  <li>Your mobile number (optional — only if you choose to give it)</li>
                  <li>Your polo handicap</li>
                  <li>How many chukkas you'd like to play, and your earliest available start time</li>
                </ul>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Why we collect it</h4>
                <p style={{ marginTop: 0 }}>
                  Solely to organise Wednesday chukkas and 2026 club fixtures. The Captain uses your details to draw balanced teams and chukka schedules, contact you about your booking when necessary, and track who is interested in upcoming matches. Our lawful basis for processing is <strong>legitimate interest</strong> — coordinating member play at a sports club — under Article 6(1)(f) of UK GDPR.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Where it's stored</h4>
                <p style={{ marginTop: 0 }}>
                  Data is stored in Google Cloud Firestore, hosted within the EU region. Google Cloud Platform is a UK GDPR-compliant processor that publishes its own data protection terms. We do not transfer your data outside the EU/UK in normal operation.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Who can see it</h4>
                <ul style={{ marginTop: 0, paddingLeft: '18px' }}>
                  <li><strong>Mobile numbers</strong> are visible only to the Captain (PIN-protected)</li>
                  <li><strong>Names and handicaps</strong> on the roster are visible to anyone with the page URL — this is intentional, so members can see who's signed up</li>
                  <li>The Captain can see and edit everything via the PIN-gated management view</li>
                </ul>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>How long we keep it</h4>
                <p style={{ marginTop: 0 }}>
                  Roster entries are overwritten when the Captain clears the roster for the next week. The members directory (names + handicaps for autofill) is retained while this booking page is in use. Fixture interest data is retained until the end of the 2026 season. You can request earlier deletion at any time.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Your rights</h4>
                <p style={{ marginTop: 0, marginBottom: '4px' }}>
                  Under UK GDPR you have the right to:
                </p>
                <ul style={{ marginTop: 0, paddingLeft: '18px' }}>
                  <li>Access the personal data we hold about you</li>
                  <li>Have inaccurate data corrected</li>
                  <li>Request deletion of your data</li>
                  <li>Object to processing or restrict it</li>
                  <li>Lodge a complaint with the UK Information Commissioner's Office at{' '}
                    <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--burgundy)' }}>ico.org.uk</a>
                  </li>
                </ul>
                <p>
                  To exercise any of these rights, ask the Club Captain to remove or amend your details — typically done in person at the club or via WhatsApp.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Cookies and tracking</h4>
                <p style={{ marginTop: 0 }}>
                  This page does not set tracking cookies or run analytics. We use your browser's session storage only to remember whether you've entered the Captain PIN (cleared automatically when you close the tab).
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Children</h4>
                <p style={{ marginTop: 0 }}>
                  This page is intended for use by polo-playing members of the club, who are typically adults. If a member under 18 wishes to sign up, a parent or guardian should do so on their behalf or contact the Captain directly.
                </p>

                <h4 style={{ marginBottom: '4px', fontFamily: "'Fraunces', serif", fontSize: '15px' }}>Changes to this notice</h4>
                <p style={{ marginTop: 0 }}>
                  We may update this notice from time to time. The "Last updated" date at the top reflects the most recent version. Material changes will be communicated to members via the WhatsApp group.
                </p>
              </div>
              <div style={{ padding: '14px 18px', borderTop: '1px solid var(--line)' }}>
                <button
                  onClick={() => setPrivacyOpen(false)}
                  style={{
                    width: '100%',
                    background: '#6b1f2a',
                    color: '#f4ecd8',
                    border: 'none',
                    padding: '12px 14px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation modal — used for destructive actions (Clear roster, Replace roster) */}
        {confirmModal && (
          <div className="share-backdrop" onClick={() => setConfirmModal(null)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px' }}>
              <div className="share-head">
                <h3>{confirmModal.title}</h3>
                <button className="share-close" onClick={() => setConfirmModal(null)} aria-label="Close">×</button>
              </div>
              <div className="share-body">
                <p style={{ margin: '0 0 18px', fontSize: '14px', color: 'var(--ink)', lineHeight: 1.55 }}>
                  {confirmModal.message}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn-secondary" onClick={() => setConfirmModal(null)} style={{ flex: 1 }}>
                    Cancel
                  </button>
                  <button
                    onClick={() => { confirmModal.onConfirm(); setConfirmModal(null); }}
                    style={{
                      flex: 1,
                      background: '#6b1f2a',
                      color: '#f4ecd8',
                      border: 'none',
                      padding: '12px 14px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    {confirmModal.confirmLabel}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
