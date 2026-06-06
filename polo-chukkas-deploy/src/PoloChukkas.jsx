import React, { useState, useEffect, useRef } from 'react';
import { generateTournamentPdf } from './tournamentPdf';

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
const ALL_MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const HANDICAP_OPTIONS = [-2, -1, 0, 1, 2, 3, 4];
// Team (aggregate) handicaps run higher than individual player handicaps — up to 12-goal.
const TEAM_HANDICAP_OPTIONS = [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

// 2026 pricing inputs for the payment screen. Pony hire is the per-chukka base;
// every military pony-hire rate sits exactly £5 below the civilian rate, so the
// military discount is modelled as a flat £5/chukka. Match-level rates and
// per-membership chukka fees get wired in when the checkout screen lands.
const MILITARY_DISCOUNT_PER_CHUKKA = 5;
const PONY_HIRE_2026 = { club: 100, '-6 to -2': 115, '-2 to 0': 120, '0 to 2': 145, '2 to 4': 180 };

// 2026 membership categories from the price list. `chukkasIncluded` drives the
// booking branch: included → added straight to the roster; not included (or no
// membership) → sent to checkout to pay per chukka.
const MEMBERSHIP_TYPES_2026 = [
  { id: 'none',             label: 'No membership · pays per chukka',    chukkasIncluded: false },
  { id: 'civ-full',         label: 'Civ · Full Playing (incl chukkas)',  chukkasIncluded: true },
  { id: 'civ-full-u23',     label: 'Civ · Full Playing U23',             chukkasIncluded: true },
  { id: 'civ-full-u16',     label: 'Civ · Full Playing U16',             chukkasIncluded: true },
  { id: 'civ-individual',   label: 'Civ · Individual (chukkas only)',    chukkasIncluded: true },
  { id: 'civ-full-excl',    label: 'Civ · Full (excl chukka fees)',      chukkasIncluded: false },
  { id: 'civ-pro',          label: 'Civ · Pro (incl chukkas)',           chukkasIncluded: true },
  { id: 'civ-nonplaying',   label: 'Civ · Non-Playing',                  chukkasIncluded: false },
  { id: 'civ-day',          label: 'Civ · Day Member',                   chukkasIncluded: false },
  { id: 'mil-full-pony',    label: 'Mil · Full Playing, Pony Owner',     chukkasIncluded: true,  mil: true },
  { id: 'mil-full-nonpony', label: 'Mil · Full Playing, Non-Pony Owner', chukkasIncluded: true,  mil: true },
  { id: 'mil-day',          label: 'Mil · Day Member',                   chukkasIncluded: false, mil: true },
  { id: 'mil-unit',         label: 'Mil · Unit Membership',              chukkasIncluded: true,  mil: true },
];
const membershipById = (id) => MEMBERSHIP_TYPES_2026.find(m => m.id === id) || MEMBERSHIP_TYPES_2026[0];

// A player accumulates live-match goals while a game is scored. Whenever a team
// or squad is reused — pulled into another fixture/match, copied to another
// day, or remembered in the teams directory — strip those goals so last match's
// score never carries over. Keeps only name + handicap, dropping empty rows.
const cleanSquad = (players) => (players || [])
  .filter(p => p && (p.name || '').trim())
  .map(p => ({ name: p.name, handicap: p.handicap ?? null }));
const CHUKKA_START_MIN_WED = 17 * 60 + 30;  // 17:30 — Wednesday default
const CHUKKA_START_MIN_THU = 10 * 60;        // 10:00 — Thursday Instructional default
const CHUKKA_START_MIN_SAT = 11 * 60;        // 11:00 — Saturday default
const CHUKKA_START_MIN_SUN = 11 * 60;        // 11:00 — Sunday default
const CHUKKA_INTERVAL_MIN = 15;
const SLOTS_PER_CHUKKA = 8; // target size for chukka-count calculation; teams may be uneven
const MIN_PLAYERS_PER_CHUKKA = 4; // target minimum; redistribution will move players to honour this where possible

// Day configuration. Each day key gets its own roster, schedule, week stamp,
// and configurable throw-in time stored independently in Firestore.
const DAY_CONFIG = {
  wed: { key: 'wed', label: 'Wed',  fullLabel: 'Wednesday',  short: 'Wed', dow: 3, eveningPrev: 'Tuesday',   defaultStartMin: CHUKKA_START_MIN_WED, tabLabel: 'Wed Chukkas' },
  thu: { key: 'thu', label: 'Thu',  fullLabel: 'Thursday',   short: 'Thu', dow: 4, eveningPrev: 'Wednesday', defaultStartMin: CHUKKA_START_MIN_THU, tabLabel: 'Thu Instructional', note: 'Instructional Chukkas · Ladies Only' },
  sat: { key: 'sat', label: 'Sat',  fullLabel: 'Saturday',   short: 'Sat', dow: 6, eveningPrev: 'Friday',    defaultStartMin: CHUKKA_START_MIN_SAT, tabLabel: 'Sat Chukkas' },
  sun: { key: 'sun', label: 'Sun',  fullLabel: 'Sunday',     short: 'Sun', dow: 0, eveningPrev: 'Saturday',  defaultStartMin: CHUKKA_START_MIN_SUN, tabLabel: 'Sun Chukkas' },
};
const DAY_KEYS = ['wed', 'thu', 'sat', 'sun'];
const GROUND_OPTIONS = ['Fisher', 'Tattoo', 'Perham Down'];

const GRENADIER_TROPHY_DETAILS = {
  days: [
    {
      id: 'sat', dateLabel: 'Saturday 30th May', ground: 'Perham Down',
      matches: [
        { id: 'm1', time: '10:00', label: '',
          teamA: { name: 'Royal Navy', handicap: -2, players: [{ name: 'Cam Ellis', handicap: 2 }, { name: 'Steve Worsley', handicap: 0 }, { name: 'Liam Molloy', handicap: -2 }, { name: 'Chris Johnson', handicap: -2 }] },
          teamB: { name: 'Legal Action', handicap: 0, players: [{ name: 'James Haigh', handicap: 2 }, { name: 'Elspeth Talbot-Rice', handicap: 0 }, { name: 'Robert Talbot-Rice', handicap: -1 }, { name: 'Jo Wells', handicap: -1 }] },
          umpires: 'Rosie Ross & Ed Whittington', notes: '' },
        { id: 'm2', time: '11:15', label: '',
          teamA: { name: 'ACT Systems/Althorne', handicap: 0, players: [{ name: 'Jose Otto Von Potobsky', handicap: 2 }, { name: 'Ed Whittington', handicap: 1 }, { name: 'Andy Boudier', handicap: -1 }, { name: 'William Whittington', handicap: -2 }] },
          teamB: { name: 'Tedworth Park', handicap: -2, players: [{ name: 'Rosie Ross', handicap: 2 }, { name: 'Clive Gregory', handicap: 0 }, { name: 'Alfie M/Helen G', handicap: -2 }, { name: 'Steve Wells', handicap: -2 }] },
          umpires: 'Steve Worsley & James Haigh', notes: 'Please self mount for umpiring duties. Please let TPPC know if you need to book a pony.' },
      ],
      prizegiving: false,
    },
    {
      id: 'sun', dateLabel: 'Sunday 31st May', ground: 'Perham Down',
      matches: [
        { id: 'm3', time: '10:00', label: 'Sub-Final',
          teamA: { name: 'TBC', handicap: null, players: [] },
          teamB: { name: 'TBC', handicap: null, players: [] },
          umpires: 'TBC', notes: '' },
        { id: 'm4', time: '11:15', label: 'Final',
          teamA: { name: 'TBC', handicap: null, players: [] },
          teamB: { name: 'TBC', handicap: null, players: [] },
          umpires: 'TBC', notes: 'Please self mount for umpiring duties. Please let TPPC know if you need to book a pony.' },
      ],
      prizegiving: true,
    },
  ],
};



// Parse a fixture's date string into a { start, end } Date range (year 2026).
// Handles: 'Sat 30 & Sun 31 May', 'Mon 25 May', 'Fri 24 & Sun 26 July' etc.
const parseFixtureDateRange = (fx) => {
  const monthMap = { January:0, February:1, March:2, April:3, May:4, June:5, July:6, August:7, September:8, October:9, November:10, December:11 };
  const month = monthMap[fx.month];
  if (month === undefined) return null;
  const nums = [...(fx.date.matchAll(/\b(\d{1,2})\b/g))].map(m => parseInt(m[1], 10)).filter(n => n >= 1 && n <= 31);
  if (!nums.length) return null;
  const start = new Date(2026, month, nums[0], 0, 0, 0, 0);
  const end   = new Date(2026, month, nums[nums.length - 1], 23, 59, 59, 999);
  return { start, end };
};
const isTournamentActive = (fx) => {
  const range = parseFixtureDateRange(fx);
  if (!range) return false;
  const now = new Date();
  return now >= range.start && now <= range.end;
};

// Derive the individual days a fixture spans from its date string, so a team
// can field a (possibly different) squad on each one.
//   'Sat 18 & Sun 19 April' → [{key:'sat', label:'Saturday 18 April'}, {key:'sun', label:'Sunday 19 April'}]
//   'Mon 25 May'            → [{key:'mon', label:'Monday 25 May'}]
const WEEKDAY_FULL = { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' };
const fixtureDays = (fx) => {
  const segs = (fx?.date || '').split('&').map(s => s.trim());
  const seen = {};
  const out = [];
  segs.forEach(seg => {
    const m = seg.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\s+(\d{1,2})/i);
    if (!m) return;
    const base = m[1].toLowerCase();
    // Keep keys unique even in the rare case a fixture repeats a weekday.
    const key = seen[base] ? `${base}${m[2]}` : base;
    seen[base] = true;
    out.push({ key, label: `${WEEKDAY_FULL[base]} ${m[2]} ${fx.month}` });
  });
  if (out.length === 0) out.push({ key: 'day', label: fx?.date || 'Match day' });
  return out;
};

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

// --- Native local notifications (iOS app only; completely inert on the web) ---
// Reached through the Capacitor runtime global so the web/Vercel build needs no
// extra dependency and is unaffected. On iOS the LocalNotifications plugin is
// injected here once @capacitor/local-notifications is installed and synced.
const CapBridge = (typeof window !== 'undefined' && window.Capacitor) ? window.Capacitor : null;
const isNativeApp = !!(CapBridge && typeof CapBridge.isNativePlatform === 'function' && CapBridge.isNativePlatform());
const LocalNotifications = (CapBridge && CapBridge.Plugins) ? CapBridge.Plugins.LocalNotifications : null;
const REMINDER_ID_BASE = 7000; // ids 7000-7999 reserved for chukka reminders

// Example rosters for testing the app
const EXAMPLES = {
  may20: {
    label: 'Wed 20 May',
    note: '17 players · 7 chukkas',
    roster: [
      { name: 'Rosie R',         handicap:  2, chukkas: 5, mobile: '07700 900012' },
      { name: 'Stevie McCraith', handicap:  2, chukkas: 3, mobile: '07700 900233' },
      { name: 'Oliver Olsen',    handicap:  1, chukkas: 4, mobile: '07700 900412' },
      { name: 'Brad',            handicap:  1, chukkas: 6, mobile: '07700 900034' },
      { name: 'Ed W',            handicap:  1, chukkas: 2, mobile: '07700 900401' },
      { name: 'Rosie L',         handicap:  0, chukkas: 5, mobile: '07700 900056' },
      { name: 'Alex W',          handicap:  0, chukkas: 4, mobile: '07700 900245' },
      { name: 'Piers F',         handicap:  0, chukkas: 2, mobile: '07700 900334' },
      { name: 'Steve Collins',   handicap:  0, chukkas: 4, mobile: '07700 900423' },
      { name: 'Robert T-R',      handicap: -1, chukkas: 3, mobile: '07700 900434' },
      { name: 'Andy B',          handicap: -1, chukkas: 4, mobile: '07700 900298' },
      { name: 'Max Morant',      handicap: -1, chukkas: 2, mobile: '07700 900445' },
      { name: 'Lizzie W',        handicap: -1, chukkas: 2, mobile: '07700 900287' },
      { name: 'William W',       handicap: -2, chukkas: 2, mobile: '07700 900147' },
      { name: 'Steve Wells',     handicap: -2, chukkas: 4, mobile: '07700 900168' },
      { name: 'Alfie',           handicap: -2, chukkas: 2, mobile: '07700 900192' },
      { name: 'Helen',           handicap: -2, chukkas: 2, mobile: '07700 900215' },
    ],
  },
  may13: {
    label: 'Wed 13 May',
    note: '10 players · 5 chukkas',
    roster: [
      { name: 'Rosie Ross', handicap:  2, chukkas: 4, mobile: '07700 900012' },
      { name: 'Brad',       handicap:  1, chukkas: 5, mobile: '07700 900034' },
      { name: 'Rosie L',    handicap:  0, chukkas: 4, mobile: '07700 900056' },
      { name: 'Sam Tay',    handicap:  0, chukkas: 3, mobile: '07700 900078' },
      { name: 'Debbie B',   handicap: -1, chukkas: 4, mobile: '07700 900091' },
      { name: 'Jo Wells',   handicap: -1, chukkas: 4, mobile: '07700 900103' },
      { name: 'William W',  handicap: -2, chukkas: 4, mobile: '07700 900147' },
      { name: 'Steve W',    handicap: -2, chukkas: 4, mobile: '07700 900168' },
      { name: 'Alfie',      handicap: -2, chukkas: 2, mobile: '07700 900192' },
      { name: 'Helen',      handicap: -2, chukkas: 2, mobile: '07700 900215' },
    ],
  },
  may6: {
    label: 'Wed 6 May',
    note: '14 players · 8 chukkas',
    roster: [
      { name: 'Rosie Ross', handicap:  2, chukkas: 6, mobile: '07700 900012' },
      { name: 'Stevie',     handicap:  2, chukkas: 4, mobile: '07700 900233' },
      { name: 'Brad',       handicap:  1, chukkas: 6, mobile: '07700 900034' },
      { name: 'Rosie L',    handicap:  0, chukkas: 6, mobile: '07700 900056' },
      { name: 'Alex W',     handicap:  0, chukkas: 5, mobile: '07700 900245' },
      { name: 'Sam Tay',    handicap:  0, chukkas: 3, mobile: '07700 900078' },
      { name: 'Lizzie W',   handicap: -1, chukkas: 2, mobile: '07700 900287' },
      { name: 'Debbie B',   handicap: -1, chukkas: 4, mobile: '07700 900091' },
      { name: 'Andy B',     handicap: -1, chukkas: 4, mobile: '07700 900298' },
      { name: 'Jo Wells',   handicap: -1, chukkas: 4, mobile: '07700 900103' },
      { name: 'William W',  handicap: -2, chukkas: 5, mobile: '07700 900147' },
      { name: 'Steve W',    handicap: -2, chukkas: 4, mobile: '07700 900168' },
      { name: 'Alfie',      handicap: -2, chukkas: 4, mobile: '07700 900192' },
      { name: 'Helen',      handicap: -2, chukkas: 2, mobile: '07700 900215' },
    ],
  },
  apr29: {
    label: 'Wed 29 April',
    note: '16 players · 8 chukkas',
    roster: [
      { name: 'Rosie Ross',      handicap:  2, chukkas: 6, mobile: '07700 900012' },
      { name: 'Brad',            handicap:  1, chukkas: 5, mobile: '07700 900034' },
      { name: 'Jose',            handicap:  1, chukkas: 8, mobile: '07700 900321' },
      { name: 'Alex Welham',     handicap:  0, chukkas: 3, mobile: '07700 900245' },
      { name: 'Rosie Lawrance',  handicap:  0, chukkas: 5, mobile: '07700 900056' },
      { name: 'Piers F',         handicap:  0, chukkas: 2, mobile: '07700 900334' },
      { name: 'Andy B',          handicap: -1, chukkas: 4, mobile: '07700 900298' },
      { name: 'Jo W',            handicap: -1, chukkas: 4, mobile: '07700 900103' },
      { name: 'Debbie',          handicap: -1, chukkas: 4, mobile: '07700 900091' },
      { name: 'Alfie',           handicap: -2, chukkas: 2, mobile: '07700 900192' },
      { name: 'Helen',           handicap: -2, chukkas: 2, mobile: '07700 900215' },
      { name: 'Steve W',         handicap: -2, chukkas: 4, mobile: '07700 900168' },
      { name: 'Karen Reeve',     handicap:  0, chukkas: 4, mobile: '07700 900347' },
      { name: 'Charlie Wilding', handicap: -2, chukkas: 2, mobile: '07700 900356' },
      { name: 'Milly Till',      handicap: -2, chukkas: 2, mobile: '07700 900369' },
      { name: 'Gabe Lewis',      handicap: -2, chukkas: 2, mobile: '07700 900372' },
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

// Separate VIP players (played first, never reduced below requested count)
// from regular players. Within each group, order is preserved (roster order
// = scheduling priority; earlier in list = first pick of chukkas).
const vipPlayers = players.filter(p => p.vip);
const regularPlayers = players.filter(p => !p.vip);
const ordered = [...vipPlayers, ...regularPlayers];

const totalRequested = ordered.reduce((s, p) => s + p.chukkas, 0);
const maxIndividual = ordered.length ? Math.max(...ordered.map(p => p.chukkas)) : 1;
// Start from the capacity- and keenest-request-driven size, then shrink only
// if there aren't enough player-slots to fill every chukka to a valid format
// (>=4 players = 2v2). effTotalSlots(K) caps each player's slots at K, so it
// reflects the slots actually available at that chukka count. This keeps
// everyone's requested count wherever the bodies allow it, and trims chukkas
// (capping the keenest, reported below) only when needed to avoid sub-format
// (1v1 / 2v1) chukkas.
let numChukkas = Math.max(1, Math.ceil(totalRequested / SLOTS_PER_CHUKKA), maxIndividual);
const effTotalSlots = (K) => ordered.reduce((s, p) => s + Math.min(p.chukkas, K), 0);
while (numChukkas > 1 && effTotalSlots(numChukkas) < MIN_PLAYERS_PER_CHUKKA * numChukkas) {
  numChukkas--;
}

// Each chukka has a strict cap of SLOTS_PER_CHUKKA (= 8 = 4 per team)
const chukkaPlayers = Array.from({ length: numChukkas }, () => []);

const assignments = new Map();
const capped = []; // wanted more chukkas than the evening has at all
const reduced = []; // got fewer chukkas than wanted due to capacity

// Helper: place one pass of chukkas for a player given a minimum step size.
// Returns the list of chukka indices placed, updating chukkaPlayers and
// chukkaPlayers in place. No per-chukka hard cap — uneven teams are allowed.
const placePlayer = (player, wantedCount, availableIdx, availableToIdx, minStep) => {
  const placed = [];

  if (minStep <= 1) {
    // Regular players: spread across the least-loaded chukkas so the load is
    // even and as many people as possible get their full requested count.
    while (placed.length < wantedCount) {
      let bestC = -1, bestLoad = Infinity;
      for (let c = availableIdx; c <= availableToIdx; c++) {
        if (chukkaPlayers[c].length >= SLOTS_PER_CHUKKA) continue; // never exceed 4v4
        if (placed.includes(c)) continue;
        if (chukkaPlayers[c].length < bestLoad) { bestLoad = chukkaPlayers[c].length; bestC = c; }
      }
      if (bestC === -1) break;
      placed.push(bestC);
      chukkaPlayers[bestC].push(player);
    }
    return placed.sort((a, b) => a - b);
  }

  // No-consecutive players: keep an every-other-chukka rhythm — a preferred gap
  // of exactly minStep (= 2) — so they're never back-to-back AND never stranded
  // (e.g. first chukka then nothing until the last). Pick the start phase
  // (odd/even) that's less loaded and can fit the most, then step by 2, only
  // widening the gap past a full chukka.
  const phaseScore = (start) => {
    let load = 0, fit = 0, last = -Infinity;
    for (let c = start; c <= availableToIdx && fit < wantedCount; c++) {
      if (c - last < minStep) continue;
      if (chukkaPlayers[c].length >= SLOTS_PER_CHUKKA) continue;
      load += chukkaPlayers[c].length; fit++; last = c;
    }
    // Heavily prefer phases that fit more of the requested chukkas, then lighter load.
    return (wantedCount - fit) * 1000 + load;
  };
  let cursor = availableIdx;
  if (availableIdx + 1 <= availableToIdx && phaseScore(availableIdx + 1) < phaseScore(availableIdx)) {
    cursor = availableIdx + 1;
  }
  while (placed.length < wantedCount && cursor <= availableToIdx) {
    // earliest non-full slot at/after the cursor that keeps the >=2 gap
    let c = cursor;
    while (c <= availableToIdx && (
      chukkaPlayers[c].length >= SLOTS_PER_CHUKKA ||
      (placed.length && c - placed[placed.length - 1] < minStep)
    )) c++;
    if (c > availableToIdx) break;
    placed.push(c);
    chukkaPlayers[c].push(player);
    cursor = c + minStep; // prefer the next slot exactly 2 chukkas later
  }
  return placed.sort((a, b) => a - b);
};

ordered.forEach(player => {
  const wantedRaw = player.chukkas;

  let availableIdx = 0;
  if (player.availableFrom) {
    const targetMin = parseTime(player.availableFrom);
    if (targetMin !== null) {
      availableIdx = Math.max(0, Math.ceil((targetMin - startMin) / CHUKKA_INTERVAL_MIN));
    }
  }
  let availableToIdx = numChukkas - 1;
  if (player.availableTo) {
    const targetMin = parseTime(player.availableTo);
    if (targetMin !== null) {
      const idx = Math.floor((targetMin - startMin) / CHUKKA_INTERVAL_MIN);
      availableToIdx = Math.min(numChukkas - 1, idx);
    }
  }
  const availableCount = Math.max(0, availableToIdx - availableIdx + 1);

  // Cap by total chukkas in the schedule
  const cappedWanted = Math.min(wantedRaw, numChukkas);
  if (cappedWanted < wantedRaw) {
    capped.push({ player, requested: wantedRaw, given: cappedWanted });
  }
  // For VIP players, never reduce below their requested count due to capacity;
  // they have already been placed first so they should always get their slots
  // (subject only to the total-chukka cap above and their availability window).
  const wanted = Math.min(cappedWanted, availableCount);

  // noConsecutive players require a gap of at least 1 chukka between
  // assignments (so they are never in back-to-back chukkas). All other
  // players use a step of 1 (adjacent slots are fine).
  const minStep = player.noConsecutive ? 2 : 1;
  let myChukkas = placePlayer(player, wanted, availableIdx, availableToIdx, minStep);

  // Intentionally NO adjacent-slot fallback for noConsecutive players: if the
  // gap-preserving pass can't fit every requested chukka (capacity pressure),
  // we leave them short — reported below — rather than break the
  // no-back-to-back rule by seating them in consecutive chukkas.

  if (myChukkas.length < cappedWanted && !player.vip) {
    reduced.push({ player, requested: cappedWanted, given: myChukkas.length });
  } else if (myChukkas.length < cappedWanted && player.vip) {
    // VIP shortfall still reported but labelled distinctly in the UI
    reduced.push({ player, requested: cappedWanted, given: myChukkas.length });
  }

  assignments.set(player.id, myChukkas.sort((a, b) => a - b));
});

// Redistribution pass — balance player counts across chukkas.
// Any chukka with more players than the thinnest one is a valid donor
// (4→3 is fine — uneven teams let more people play). VIP players are never moved.
let safety = numChukkas * SLOTS_PER_CHUKKA * 2;
while (safety-- > 0) {
  // Find the chukka with the fewest players (below MIN_PLAYERS_PER_CHUKKA)
  let underIdx = -1, underCount = MIN_PLAYERS_PER_CHUKKA;
  for (let i = 0; i < numChukkas; i++) {
    if (chukkaPlayers[i].length < underCount) {
      underIdx = i;
      underCount = chukkaPlayers[i].length;
    }
  }
  if (underIdx === -1) break;

  // Find the donor: most-loaded chukka that has strictly more players than underIdx
  let bestSrcIdx = -1, bestPlayer = null, bestSrcCount = underCount;
  for (let s = 0; s < numChukkas; s++) {
    if (s === underIdx) continue;
    if (chukkaPlayers[s].length <= bestSrcCount) continue;
    const movable = chukkaPlayers[s].find(p =>
      !p.vip &&
      !chukkaPlayers[underIdx].some(q => q.id === p.id) &&
      // Don't move a no-consecutive player into a chukka next to one they're
      // already in — that would create the back-to-back we're avoiding.
      !(p.noConsecutive && (
        (underIdx > 0 && chukkaPlayers[underIdx - 1].some(q => q.id === p.id)) ||
        (underIdx < numChukkas - 1 && chukkaPlayers[underIdx + 1].some(q => q.id === p.id))
      ))
    );
    if (movable) {
      bestSrcIdx = s;
      bestPlayer = movable;
      bestSrcCount = chukkaPlayers[s].length;
    }
  }
  if (bestSrcIdx === -1) break;

  chukkaPlayers[bestSrcIdx] = chukkaPlayers[bestSrcIdx].filter(p => p.id !== bestPlayer.id);
  chukkaPlayers[underIdx].push(bestPlayer);
}

// Build each chukka with balanced teams. Teams may be uneven (e.g. 4v3) when
// player counts are odd — that is acceptable and preferred over leaving people out.
// Build each chukka's teams while keeping every player on ONE shirt colour for
// the whole evening, so nobody has to keep swapping bibs. A player's colour
// (teamA = Blue, teamB = White) is fixed the first time they appear and reused
// in every later chukka. Per-chukka size caps keep the teams within one player
// of each other; a player is only moved off their colour when their side is
// full (unavoidable for a playable game), and that becomes their colour from
// then on. New players fill the lighter side, balancing size then handicap.
const playerColor = new Map(); // id -> 'A' | 'B'

// Seed the first four players (roster order) onto alternating shirt colours so
// they're always split across the two teams, whichever chukka they're in:
// 1st White, 2nd Blue, 3rd White, 4th Blue. (teamA = Blue = 'A', teamB = White
// = 'B'.) They're seated before anyone else in each chukka so they keep these
// colours; everyone else is coloured by the balancing algorithm below.
const fixedColorIds = new Set();
players.slice(0, 4).forEach((p, i) => {
  playerColor.set(p.id, i % 2 === 0 ? 'B' : 'A'); // even index → White(B), odd → Blue(A)
  fixedColorIds.add(p.id);
});

const chukkas = chukkaPlayers.map((inChukka, c) => {
  const n = inChukka.length;
  const capA = Math.ceil(n / 2);
  const capB = n - capA;
  const sorted = [...inChukka].sort((a, b) => b.handicap - a.handicap);

  const teamA = [], teamB = [];
  let sumA = 0, sumB = 0;
  const addA = (p) => { teamA.push(p); sumA += p.handicap; playerColor.set(p.id, 'A'); };
  const addB = (p) => { teamB.push(p); sumB += p.handicap; playerColor.set(p.id, 'B'); };

  const place = (p) => {
    const want = playerColor.get(p.id);
    const roomA = teamA.length < capA;
    const roomB = teamB.length < capB;
    let col;
    if (want === 'A' && roomA) col = 'A';            // keep their shirt
    else if (want === 'B' && roomB) col = 'B';       // keep their shirt
    else if (roomA && !roomB) col = 'A';             // only one side has room
    else if (roomB && !roomA) col = 'B';
    else if (teamA.length !== teamB.length) col = teamA.length < teamB.length ? 'A' : 'B'; // balance size
    else col = sumA <= sumB ? 'A' : 'B';             // balance handicap
    (col === 'A' ? addA : addB)(p);
  };

  // Fixed first-four seated first (so they always keep their colour), then
  // other returning players (honour their colour), then newcomers (balance).
  sorted.filter(p => fixedColorIds.has(p.id)).forEach(place);
  sorted.filter(p => !fixedColorIds.has(p.id) && playerColor.has(p.id)).forEach(place);
  sorted.filter(p => !playerColor.has(p.id)).forEach(place);

  return {
    idx: c,
    number: c + 1,
    time: chukkaTime(c, startMin),
    isEarly: c < numChukkas / 2,
    teamA, teamB, sumA, sumB,
    playerCount: n,
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
const [vip, setVip] = useState(false);
const [noConsecutive, setNoConsecutive] = useState(false);
const [ponyHire, setPonyHire] = useState(true);  // signup: needs to hire a pony (affects price)
  const [error, setError] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');   // post-signup cost confirmation
  const [dueMethod, setDueMethod] = useState({});      // per-due payment-method picker in Checkout

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
  // Player database — captain-curated records, richer than the members autofill
  // cache. Synced under 'players'. Named playerDb to avoid clashing with the
  // existing roster `players` accessor. Carries military + subsidies[] so the
  // upcoming payment screen can attach subsidy pricing.
  const [playerDb, setPlayerDb] = useState([]);
  const [playerEditor, setPlayerEditor] = useState(null); // null | draft record being added/edited
  const [playerSearch, setPlayerSearch] = useState('');
  const [pdbError, setPdbError] = useState('');
  // Subsidies — captain-managed pots that fund per-chukka discounts for military
  // players. Synced under 'subsidies'. playersView toggles the Players tab between
  // the player list and subsidy management.
  const [subsidies, setSubsidies] = useState([]);
  const [subsidyEditor, setSubsidyEditor] = useState(null); // null | draft
  const [subError, setSubError] = useState('');
  const [playersView, setPlayersView] = useState('players'); // 'players' | 'subsidies' | 'checkout'
  const [transactions, setTransactions] = useState([]);
  const [checkout, setCheckout] = useState({ playerId: '', day: 'wed', chukkas: '4', ponyLevel: 'club', method: 'cash', note: '' });
  const [coError, setCoError] = useState('');

  // Fixtures state
  const [interest, setInterest] = useState({}); // { [fixtureId]: [{ id, name, handicap, mobile?, email? }] }
  const [expandedId, setExpandedId] = useState(null);
  const [fName, setFName] = useState('');
  const [fHandicap, setFHandicap] = useState('');
  const [fMobile, setFMobile] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fError, setFError] = useState('');
  const [fixtureDetails, setFixtureDetails] = useState({});
  const [teamsDb, setTeamsDb] = useState({}); // { [teamNameLower]: { name, handicap, players: [{name, handicap}] } }

  // Tournament team sign-ups — a team enters a fixture and can field a
  // different squad per day (e.g. Sat line-up ≠ Sun line-up by availability).
  // { [fixtureId]: [{ id, team, handicap, contact?, mobile?, perDay, days: { [dayKey]: [{name, handicap}] } }] }
  const [teamSignups, setTeamSignups] = useState({});
  const [tName, setTName] = useState('');
  const [tHandicap, setTHandicap] = useState('');
  const [tContact, setTContact] = useState('');
  const [tMobile, setTMobile] = useState('');
  const [tPerDay, setTPerDay] = useState(false);
  const [tSquads, setTSquads] = useState({}); // working draft: { [dayKey]: [{name, handicap}] }
  const [tError, setTError] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);

  // Captain-editable fixtures list — seeded from the built-in 2026 list, then
  // persisted so captains can add ad hoc fixtures, edit details, and change the
  // handicap level. Stored under 'fixtures' and synced across devices.
  const [fixtures, setFixtures] = useState(FIXTURES_2026);
  // True once the Firestore 'fixtures' doc has been read at least once. Until then
  // we must not persist the built-in seed — doing so would resurrect deleted
  // fixtures (and wipe ad hoc ones) for everyone.
  const fixturesLoadedRef = useRef(false);
  const [fixtureEditor, setFixtureEditor] = useState(null); // null | { id?, month, date, name, level }
  const [editingDetailsId, setEditingDetailsId] = useState(null);
  const [showBackups, setShowBackups] = useState(false);
  const [backups, setBackups] = useState([]);
  const backupTimerRef = useRef(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState('');

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
  const [liveFixtureId, setLiveFixtureId] = useState(null);
  const [liveDayId, setLiveDayId] = useState(null);
  const [liveMatchId, setLiveMatchId] = useState(null);
  const [liveDate, setLiveDate] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const scheduleRef = useRef(null);

  // Scroll to the current/nearest fixture when the fixtures tab is opened.
  useEffect(() => {
    if (activeTab !== 'fixtures') return;
    const timer = setTimeout(() => {
      const now = new Date();
      let targetId = null;
      let bestDiff = Infinity;
      fixtures.forEach(fx => {
        const range = parseFixtureDateRange(fx);
        if (!range) return;
        const diff = now - range.start;
        if (diff >= 0 && diff < bestDiff) { bestDiff = diff; targetId = fx.id; }
      });
      if (!targetId) targetId = fixtures[0]?.id;
      if (targetId) {
        const el = document.querySelector('[data-fixture-id="' + targetId + '"]');
        if (el) {
          const nav = document.querySelector('.tabs');
          const navH = nav ? nav.offsetHeight : 44;
          const top = el.getBoundingClientRect().top + window.pageYOffset - navH - 8;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Sign-up cutoff datetime (ms) for a day — mirrors isBookingClosed():
  //   Wed closes Tuesday 12:00; Sat/Sun/Thu close 24h before throw-in.
  const cutoffTime = (dayKey) => {
    if (dayKey === 'wed') {
      const wed = targetDayThrowIn('wed');
      const tue = new Date(wed);
      tue.setDate(wed.getDate() - 1);
      tue.setHours(12, 0, 0, 0);
      return tue.getTime();
    }
    return targetDayThrowIn(dayKey).getTime() - CUTOFF_HOURS * 60 * 60 * 1000;
  };

  // Schedule iOS reminders for upcoming sessions that have sign-ups. Re-run on
  // launch and whenever rosters / throw-in times change. No-op on the web.
  const refreshLocalReminders = async () => {
    if (!isNativeApp || !LocalNotifications) return;
    try {
      let perm = await LocalNotifications.checkPermissions();
      if (perm.display !== 'granted') perm = await LocalNotifications.requestPermissions();
      if (perm.display !== 'granted') return;

      // Clear our own previously scheduled reminders before re-adding them.
      const pending = await LocalNotifications.getPending();
      const ours = (pending.notifications || []).filter(
        n => n.id >= REMINDER_ID_BASE && n.id < REMINDER_ID_BASE + 1000
      );
      if (ours.length) await LocalNotifications.cancel({ notifications: ours.map(n => ({ id: n.id })) });

      const now = Date.now();
      const toSchedule = [];
      DAY_KEYS.forEach((dayKey, i) => {
        const roster = rosters[dayKey] || [];
        if (!roster.length) return; // only remind about days that actually have players
        const cfg = DAY_CONFIG[dayKey];
        const timeStr = fmtTime(throwInMins[dayKey]);

        // Throw-in reminder — 2 hours before.
        const remindAt = targetDayThrowIn(dayKey).getTime() - 120 * 60 * 1000;
        if (remindAt > now + 60 * 1000) {
          toSchedule.push({
            id: REMINDER_ID_BASE + i * 2,
            title: 'Polo today 🏇',
            body: `${cfg.fullLabel} chukkas — throw-in ${timeStr}. ${roster.length} signed up.`,
            schedule: { at: new Date(remindAt) },
          });
        }

        // Sign-ups closing reminder — 3 hours before the cutoff.
        const closeText = dayKey === 'wed' ? 'Tuesday at 12:00' : `${cfg.eveningPrev} at ${timeStr}`;
        const warnAt = cutoffTime(dayKey) - 180 * 60 * 1000;
        if (warnAt > now + 60 * 1000) {
          toSchedule.push({
            id: REMINDER_ID_BASE + i * 2 + 1,
            title: 'Sign-ups closing soon',
            body: `${cfg.fullLabel} chukkas sign-ups close ${closeText}.`,
            schedule: { at: new Date(warnAt) },
          });
        }
      });
      if (toSchedule.length) await LocalNotifications.schedule({ notifications: toSchedule });
    } catch (e) { /* reminders are best-effort — never block the app */ }
  };

  // (Re)schedule reminders on launch and whenever sessions change. iOS only.
  useEffect(() => {
    refreshLocalReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rosters, throwInMins]);

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
    setActiveTab(prev => (prev === 'players' ? 'wed' : prev));
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
        const fd = await window.storage.get('fixture-details', true);
        if (fd?.value) {
          let parsed = JSON.parse(fd.value);
          // Legacy cleanup: an early build wrongly seeded the Grenadier Trophy
          // sample onto fixture 'may-30-b' (Queen's Royal Lancers Trophy). Remove
          // it only if it's still the untouched sample, so any real edits stay.
          if (parsed['may-30-b'] && JSON.stringify(parsed['may-30-b']) === JSON.stringify(GRENADIER_TROPHY_DETAILS)) {
            const cleaned = { ...parsed };
            delete cleaned['may-30-b'];
            parsed = cleaned;
            try { await window.storage.set('fixture-details', JSON.stringify(parsed), true); } catch (e) {}
          }
          setFixtureDetails(parsed);
        }
        const tdb = await window.storage.get('teams-db', true);
        if (tdb?.value) setTeamsDb(JSON.parse(tdb.value));
        const ts = await window.storage.get('team-signups', true);
        if (ts?.value) setTeamSignups(JSON.parse(ts.value));
        const fxs = await window.storage.get('fixtures', true);
        if (fxs?.value) {
          // Firestore is authoritative once the doc exists: apply it verbatim,
          // even if it is shorter than the built-in seed (captains may have
          // deleted fixtures). This stops the hardcoded FIXTURES_2026 seed from
          // masquerading as live data — which was resurrecting deleted fixtures
          // (e.g. Queen's Royal Lancers) and hiding ad hoc ones (e.g. 9th Lancer).
          const arr = JSON.parse(fxs.value);
          if (Array.isArray(arr)) setFixtures(arr);
          fixturesLoadedRef.current = true;
        } else {
          // No fixtures doc yet (genuine first run): establish it from the
          // built-in seed so future adds/edits/deletes persist instead of
          // falling back to the seed on the next load.
          try { await window.storage.set('fixtures', JSON.stringify(FIXTURES_2026), true); } catch (e) {}
          fixturesLoadedRef.current = true;
        }
      } catch (e) {}
      try {
        const w = await window.storage.get('wa-link', true);
        if (w?.value) setWaLink(w.value);
      } catch (e) {}
      try {
        const m = await window.storage.get('members', true);
        if (m?.value) setMembers(JSON.parse(m.value));
      } catch (e) {}
      try {
        const p = await window.storage.get('players', true);
        if (p?.value) { const arr = JSON.parse(p.value); if (Array.isArray(arr)) setPlayerDb(arr); }
      } catch (e) {}
      try {
        const s = await window.storage.get('subsidies', true);
        if (s?.value) { const arr = JSON.parse(s.value); if (Array.isArray(arr)) setSubsidies(arr); }
      } catch (e) {}
      try {
        const t = await window.storage.get('transactions', true);
        if (t?.value) { const arr = JSON.parse(t.value); if (Array.isArray(arr)) setTransactions(arr); }
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
        vip: player.vip || false,
        noConsecutive: player.noConsecutive || false,
        lastUsed: Date.now(),
      },
    };
    setMembers(updated);
    try { await window.storage.set('members', JSON.stringify(updated), true); } catch (e) {}
    return updated;
  };

  // --- Player database (captain-managed) ---
  const PLAYER_TYPES = ['Member', 'Associate', 'Guest'];
  const blankPlayer = () => ({
    id: '', name: '', handicap: '', email: '', mobile: '',
    type: 'Member', membership: 'none', military: false, unit: '', active: true,
    subsidies: [], notes: '',
  });
  const newPlayerId = (salt = '') => `p-${Date.now()}-${salt}${Math.random().toString(36).slice(2, 7)}`;
  const savePlayerDb = async (next) => {
    setPlayerDb(next);
    try { await window.storage.set('players', JSON.stringify(next), true); } catch (e) {}
  };
  const openNewPlayer = () => { setPdbError(''); setPlayerEditor(blankPlayer()); };
  const openEditPlayer = (p) => {
    setPdbError('');
    setPlayerEditor({ ...blankPlayer(), ...p, handicap: p.handicap == null ? '' : String(p.handicap) });
  };
  const savePlayer = async () => {
    const draft = playerEditor || {};
    const name = (draft.name || '').trim();
    if (!name) { setPdbError('Please enter a name.'); return; }
    const email = (draft.email || '').trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setPdbError('That email address looks off.'); return; }
    const record = {
      id: draft.id || newPlayerId(),
      name,
      handicap: draft.handicap === '' || draft.handicap == null ? null : Number(draft.handicap),
      email,
      mobile: (draft.mobile || '').trim(),
      type: draft.type || 'Member',
      membership: draft.membership || 'none',
      military: !!draft.military,
      unit: draft.military ? (draft.unit || '').trim() : '',
      active: draft.active !== false,
      subsidies: Array.isArray(draft.subsidies) ? draft.subsidies : [],
      notes: (draft.notes || '').trim(),
      updatedAt: Date.now(),
    };
    const exists = playerDb.some(p => p.id === record.id);
    const next = (exists ? playerDb.map(p => (p.id === record.id ? record : p)) : [...playerDb, record])
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    await savePlayerDb(next);
    // Keep the lightweight members autofill cache in step with the database.
    try { await upsertMember({ name: record.name, handicap: record.handicap, mobile: record.mobile }); } catch (e) {}
    setPlayerEditor(null);
    setPdbError('');
  };
  const deletePlayer = async (id) => {
    const p = playerDb.find(x => x.id === id);
    if (!window.confirm(`Remove ${p ? p.name : 'this player'} from the database? This does not affect rosters or fixtures.`)) return;
    await savePlayerDb(playerDb.filter(x => x.id !== id));
    setPlayerEditor(null);
  };
  const importEveryone = async () => {
    setPdbError('');
    const found = new Map(); // lower -> { name, handicap, mobile }
    const add = (nm, handicap, mobile) => {
      const name = (nm || '').trim();
      if (!name || name.toUpperCase() === 'TBC') return;
      const key = name.toLowerCase();
      const cur = found.get(key) || { name, handicap: null, mobile: '' };
      if ((cur.handicap == null) && handicap != null && handicap !== '') cur.handicap = handicap;
      if (!cur.mobile && mobile) cur.mobile = mobile;
      found.set(key, cur);
    };
    // Chukkas: members directory + every day's roster
    Object.values(members).forEach(m => add(m && m.name, m && m.handicap, m && m.mobile));
    Object.values(rosters || {}).forEach(arr => Array.isArray(arr) && arr.forEach(p => add(p.name, p.handicap, p.mobile)));
    // Tournaments: per-day sign-up squads, published match line-ups, teams DB
    Object.values(teamSignups || {}).forEach(list => Array.isArray(list) && list.forEach(s => {
      Object.values((s && s.days) || {}).forEach(sq => Array.isArray(sq) && sq.forEach(p => add(p.name, p.handicap)));
    }));
    Object.values(fixtureDetails || {}).forEach(det => ((det && det.days) || []).forEach(d => ((d && d.matches) || []).forEach(m => {
      ['teamA', 'teamB'].forEach(tk => ((m[tk] && m[tk].players) || []).forEach(p => add(p.name, p.handicap)));
    })));
    Object.values(teamsDb || {}).forEach(t => ((t && t.players) || []).forEach(p => add(p.name, p.handicap)));

    const existing = new Set(playerDb.map(p => (p.name || '').trim().toLowerCase()));
    const additions = [...found.values()]
      .filter(f => !existing.has(f.name.toLowerCase()))
      .map((f, i) => ({
        id: newPlayerId(`${i}-`),
        name: f.name,
        handicap: (f.handicap == null || f.handicap === '') ? null : Number(f.handicap),
        email: '', mobile: f.mobile || '', type: 'Member', membership: 'none',
        military: false, unit: '', active: true, subsidies: [], notes: '',
        updatedAt: Date.now(),
      }));
    if (!additions.length) { setPdbError('Everyone from chukkas and tournaments is already registered.'); return; }
    await savePlayerDb([...playerDb, ...additions].sort((a, b) => (a.name || '').localeCompare(b.name || '')));
    setPdbError(`Registered ${additions.length} player${additions.length === 1 ? '' : 's'} from chukkas and tournaments. Now set their memberships below.`);
  };
  const visiblePlayers = playerDb
    .filter(p => !playerSearch.trim() || (p.name || '').toLowerCase().includes(playerSearch.trim().toLowerCase()))
    .slice()
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  // --- Subsidies (captain-managed pots that power the payment screen) ---
  const fmtMoney = (n) => (Math.round((Number(n) || 0) * 100) / 100).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const newSubsidyId = () => `s-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const blankSubsidy = () => ({ id: '', name: '', balance: '', discountPerChukka: '', lowThreshold: '', active: true });
  const saveSubsidies = async (next) => {
    setSubsidies(next);
    try { await window.storage.set('subsidies', JSON.stringify(next), true); } catch (e) {}
  };
  const openNewSubsidy = () => { setSubError(''); setSubsidyEditor(blankSubsidy()); };
  const openEditSubsidy = (s) => {
    setSubError('');
    setSubsidyEditor({ id: s.id, name: s.name, balance: String(s.balance ?? ''), discountPerChukka: String(s.discountPerChukka ?? ''), lowThreshold: String(s.lowThreshold ?? ''), active: s.active !== false });
  };
  const saveSubsidy = async () => {
    const d = subsidyEditor || {};
    const name = (d.name || '').trim();
    if (!name) { setSubError('Please name the subsidy.'); return; }
    const disc = Number(d.discountPerChukka);
    if (!(disc > 0)) { setSubError('Per-chukka discount must be greater than £0.'); return; }
    const low = d.lowThreshold === '' ? 0 : Number(d.lowThreshold);
    if (isNaN(low) || low < 0) { setSubError('Low-balance threshold must be £0 or more.'); return; }
    const existing = subsidies.find(x => x.id === d.id);
    let record;
    if (existing) {
      // Editing never overwrites a live pot — the balance only moves via top-ups/spending.
      record = { ...existing, name, discountPerChukka: disc, lowThreshold: low, active: d.active !== false, updatedAt: Date.now() };
    } else {
      const opening = d.balance === '' ? 0 : Number(d.balance);
      if (isNaN(opening) || opening < 0) { setSubError('Opening balance must be £0 or more.'); return; }
      record = {
        id: newSubsidyId(), name, balance: opening, discountPerChukka: disc, lowThreshold: low,
        active: d.active !== false,
        topups: opening > 0 ? [{ id: newSubsidyId(), date: Date.now(), amount: opening, note: 'Opening balance' }] : [],
        spent: 0, updatedAt: Date.now(),
      };
    }
    const next = (existing ? subsidies.map(x => (x.id === record.id ? record : x)) : [...subsidies, record])
      .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    await saveSubsidies(next);
    setSubsidyEditor(null);
    setSubError('');
  };
  const topUpSubsidy = async (id) => {
    const s = subsidies.find(x => x.id === id); if (!s) return;
    const raw = window.prompt(`Top up "${s.name}". Current balance £${fmtMoney(s.balance)}.\nAmount to add (£):`, '');
    if (raw == null) return;
    const amt = Number(raw);
    if (!(amt > 0)) { setSubError('Top-up amount must be greater than £0.'); return; }
    const newBal = (Number(s.balance) || 0) + amt;
    const next = subsidies.map(x => (x.id === id
      ? { ...x, balance: newBal, topups: [...(x.topups || []), { id: newSubsidyId(), date: Date.now(), amount: amt }], updatedAt: Date.now() }
      : x));
    await saveSubsidies(next);
    setSubError(`Topped up "${s.name}" by £${fmtMoney(amt)} — new balance £${fmtMoney(newBal)}.`);
  };
  const deleteSubsidy = async (id) => {
    const s = subsidies.find(x => x.id === id);
    if (!window.confirm(`Delete subsidy "${s ? s.name : ''}"? The remaining pot balance is discarded and it is removed from all players.`)) return;
    await saveSubsidies(subsidies.filter(x => x.id !== id));
    const cleaned = playerDb.map(p => (Array.isArray(p.subsidies) && p.subsidies.includes(id)) ? { ...p, subsidies: p.subsidies.filter(sid => sid !== id) } : p);
    if (JSON.stringify(cleaned) !== JSON.stringify(playerDb)) await savePlayerDb(cleaned);
    setSubsidyEditor(null);
  };
  const activeSubsidies = subsidies.filter(s => s.active !== false);
  const lowSubsidies = activeSubsidies.filter(s => (Number(s.balance) || 0) <= (Number(s.lowThreshold) || 0));

  // --- Payments / checkout (manual mark-paid; Stripe slots in here later) ---
  const chukkaFeeFor = (p) => {
    const mem = membershipById((p && p.membership) || 'none');
    if (mem.chukkasIncluded) return 0;
    const mil = !!(p && p.military) || !!mem.mil;
    if (mil) return mem.id === 'none' ? 20 : 11;   // military: non-member £20 vs member £11
    return mem.id === 'civ-day' ? 16 : 26;          // civilian: day member £16 vs non-member £26
  };
  const priceBooking = (player, chukkas, ponyLevel) => {
    const n = Math.max(0, parseInt(chukkas, 10) || 0);
    const mem = membershipById((player && player.membership) || 'none');
    const wantsPony = !!ponyLevel && ponyLevel !== 'none';
    const ponyHire = wantsPony ? (PONY_HIRE_2026[ponyLevel] != null ? PONY_HIRE_2026[ponyLevel] : PONY_HIRE_2026.club) : 0;
    const chukkaFee = mem.chukkasIncluded ? 0 : chukkaFeeFor(player);   // pony hire is charged separately, even to members
    if (n === 0 || (ponyHire === 0 && chukkaFee === 0)) {
      return { freeToRoster: true, chukkas: n, ponyLevel: ponyLevel || 'club', wantsPony, ponyHire: 0, chukkaFee, gross: 0, militaryDiscount: 0, subsidyDeductions: [], total: 0 };
    }
    const gross = (ponyHire + chukkaFee) * n;
    const militaryDiscount = (wantsPony && player && player.military ? MILITARY_DISCOUNT_PER_CHUKKA : 0) * n; // the £5 is the pony-hire delta
    let running = Math.max(0, gross - militaryDiscount);
    const subsidyDeductions = [];
    ((player && player.subsidies) || []).forEach(sid => {
      const s = subsidies.find(x => x.id === sid && x.active !== false);
      if (!s) return;
      const desired = (Number(s.discountPerChukka) || 0) * n;
      const amount = Math.max(0, Math.min(desired, Number(s.balance) || 0, running)); // capped at pot + remaining total
      if (desired > 0) subsidyDeductions.push({ id: s.id, name: s.name, amount, desired, capped: amount < desired });
      running -= amount;
    });
    const total = Math.max(0, running);
    return { freeToRoster: total <= 0, chukkas: n, ponyLevel: ponyLevel || 'club', wantsPony, ponyHire, chukkaFee, gross, militaryDiscount, subsidyDeductions, total };
  };
  const addPlayerToRoster = async (dayKey, player, chukkas) => {
    const list = rosters[dayKey] || [];
    const norm = (player.name || '').trim().replace(/\s+/g, ' ').toLowerCase();
    if (list.some(p => (p.name || '').trim().replace(/\s+/g, ' ').toLowerCase() === norm)) return false;
    const entry = {
      id: Date.now(), name: player.name, mobile: player.mobile || undefined,
      handicap: player.handicap == null ? 0 : Number(player.handicap),
      chukkas: Math.max(1, Math.min(8, parseInt(chukkas, 10) || 1)),
      availableFrom: '', availableTo: '', vip: false, noConsecutive: false,
    };
    await saveRoster([...list, entry], dayKey);
    return true;
  };
  const recordPayment = async (player, bd, opts) => {
    const o = opts || {};
    const paid = (bd.subsidyDeductions || []).filter(d => d.amount > 0);
    if (paid.length) {
      const nextSubs = subsidies.map(s => {
        const d = paid.find(x => x.id === s.id);
        return d ? { ...s, balance: (Number(s.balance) || 0) - d.amount, spent: (Number(s.spent) || 0) + d.amount, updatedAt: Date.now() } : s;
      });
      await saveSubsidies(nextSubs);
    }
    const tx = {
      id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: Date.now(),
      playerId: player.id, playerName: player.name, chukkas: bd.chukkas, ponyLevel: bd.ponyLevel,
      ponyHire: bd.ponyHire, chukkaFee: bd.chukkaFee, gross: bd.gross, militaryDiscount: bd.militaryDiscount,
      subsidyDeductions: paid.map(d => ({ id: d.id, name: d.name, amount: d.amount })),
      total: bd.total, status: 'paid', day: o.day || null, method: o.method || 'manual', note: (o.note || '').trim(), paidDate: Date.now(),
    };
    const nextTx = [tx, ...transactions];
    setTransactions(nextTx);
    try { await window.storage.set('transactions', JSON.stringify(nextTx), true); } catch (e) {}
    if (o.addToRoster && o.day) await addPlayerToRoster(o.day, player, bd.chukkas);
    return tx;
  };
  const markDuePaid = async (txId, method) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx || tx.status === 'paid') return;
    if (tx.subsidyDeductions && tx.subsidyDeductions.length) {
      const nextSubs = subsidies.map(s => {
        const d = tx.subsidyDeductions.find(x => x.id === s.id);
        if (!d) return s;
        const take = Math.max(0, Math.min(d.amount, Number(s.balance) || 0)); // never push a pot negative
        return { ...s, balance: (Number(s.balance) || 0) - take, spent: (Number(s.spent) || 0) + take, updatedAt: Date.now() };
      });
      await saveSubsidies(nextSubs);
    }
    const next = transactions.map(t => (t.id === txId ? { ...t, status: 'paid', method: method || 'cash', paidDate: Date.now() } : t));
    setTransactions(next);
    try { await window.storage.set('transactions', JSON.stringify(next), true); } catch (e) {}
  };
  const voidDue = async (txId) => {
    const tx = transactions.find(t => t.id === txId);
    if (!tx) return;
    if (!window.confirm(`Remove the £${fmtMoney(tx.total)} charge for ${tx.playerName}? Use this if they didn't play or you've taken them off the roster.`)) return;
    const next = transactions.filter(t => t.id !== txId);
    setTransactions(next);
    try { await window.storage.set('transactions', JSON.stringify(next), true); } catch (e) {}
  };
  const doMarkPaid = async () => {
    setCoError('');
    const pl = playerDb.find(p => p.id === checkout.playerId);
    if (!pl) { setCoError('Pick a player first.'); return; }
    const dayUp = (checkout.day || 'wed').toUpperCase();
    const bd = priceBooking(pl, checkout.chukkas, checkout.ponyLevel);
    if (bd.freeToRoster) {
      const added = await addPlayerToRoster(checkout.day, pl, checkout.chukkas);
      setCoError(added ? `${pl.name} added to ${dayUp} roster — no charge.` : `${pl.name} is already on the ${dayUp} roster.`);
      return;
    }
    await recordPayment(pl, bd, { method: checkout.method, note: checkout.note, addToRoster: true, day: checkout.day });
    setCoError(`Recorded £${fmtMoney(bd.total)} (${checkout.method}) for ${pl.name} and added to ${dayUp} roster.`);
    setCheckout(prev => ({ ...prev, playerId: '', note: '' }));
  };

  // Fill the booking form from a saved member
  const fillFromMember = (m) => {
    setName(m.name);
    setMobile(m.mobile || '');
    setHandicap(String(m.handicap));
    // Availability is day-specific — it depends on that day's throw-in and
    // chukka times — so we deliberately do NOT carry it across sessions (same
    // reasoning as chukkas). Clear it; it defaults to this day's throw-in /
    // no upper cap. (Prevents e.g. a Wednesday "available to 18:45" wrongly
    // resurfacing on a Saturday with a different schedule.)
    setAvailableFrom('');
    setAvailableTo('');
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
 
      vip: captainMode ? vip : false,
      noConsecutive: noConsecutive,
      ponyHire: ponyHire,   };
    saveRoster([...players, newPlayer]);
    upsertMember(newPlayer);
    // Interim (pre-Stripe): quote the cost and, if anything is owed, log a 'due'
    // item the captain settles under Checkout. They go on the roster either way;
    // the captain can remove them later if unpaid.
    {
      const rec = playerDb.find(p => (p.name || '').trim().toLowerCase() === cleanedName.toLowerCase());
      const subject = rec || { membership: 'none', military: false, subsidies: [] };
      const bd = priceBooking(subject, c, ponyHire ? 'club' : 'none');
      if (bd.total > 0) {
        const dueTx = {
          id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, date: Date.now(),
          playerId: rec ? rec.id : null, playerName: cleanedName, day: activeDay,
          chukkas: c, ponyLevel: ponyHire ? 'club' : 'none',
          ponyHire: bd.ponyHire, chukkaFee: bd.chukkaFee, gross: bd.gross, militaryDiscount: bd.militaryDiscount,
          subsidyDeductions: bd.subsidyDeductions.filter(d => d.amount > 0).map(d => ({ id: d.id, name: d.name, amount: d.amount })),
          total: bd.total, status: 'due', method: '', note: '',
        };
        const nextTx = [dueTx, ...transactions];
        setTransactions(nextTx);
        window.storage.set('transactions', JSON.stringify(nextTx), true).catch(() => {});
        setBookingMsg(`Added to the roster. £${fmtMoney(bd.total)} due${ponyHire ? ' (incl. pony hire)' : ''} — please settle with the Captain.`);
      } else {
        setBookingMsg('Added to the roster — no charge.');
      }
    }
    setName(''); setMobile(''); setHandicap(''); setChukkas(''); setAvailableFrom(''); setAvailableTo(''); setVip(false); setNoConsecutive(false); setPonyHire(true);
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
      const seeded = ex.roster.map((p, i) => ({ id: now + i, vip: false, noConsecutive: false, ...p }));
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
  // Toggle VIP flag for a player (captain only)
  const toggleVip = (id) => {
    const updated = players.map(p => p.id === id ? { ...p, vip: !p.vip } : p);
    saveRoster(updated);
    saveSchedule(null);
  };

  // Toggle noConsecutive flag for a player (captain only)
  const toggleNoConsecutive = (id) => {
    const updated = players.map(p => p.id === id ? { ...p, noConsecutive: !p.noConsecutive } : p);
    saveRoster(updated);
    saveSchedule(null);
  };

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
    // No strict per-team cap — uneven teams are acceptable
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
    // No strict per-chukka cap — uneven teams are acceptable
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
        // Drop into the smaller team (uneven teams are acceptable)
        if (ck.teamA.length <= ck.teamB.length) {
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
    // No strict per-chukka cap — uneven teams are acceptable
    updateSchedule((ck, idx) => {
      if (idx !== chukkaIdx) return ck;
      const already = ck.teamA.find(p => p.id === playerId) || ck.teamB.find(p => p.id === playerId);
      if (already) return ck;
      if (ck.teamA.length <= ck.teamB.length) {
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

  const saveTeamsDb = async (next) => {
    setTeamsDb(next);
    try { await window.storage.set('teams-db', JSON.stringify(next), true); } catch (e) {}
  };

  // Extract teams from fixture details and persist them to the teams-db for future autofill
  const persistTeamsFromDetails = async (details) => {
    const next = { ...teamsDb };
    Object.values(details).forEach(det => {
      (det?.days || []).forEach(day => {
        (day?.matches || []).forEach(m => {
          ['teamA', 'teamB'].forEach(tk => {
            const t = m[tk];
            if (t?.name?.trim()) {
              const key = t.name.trim().toLowerCase();
              next[key] = { name: t.name.trim(), handicap: t.handicap ?? null, players: cleanSquad(t.players) };
            }
          });
        });
      });
    });
    await saveTeamsDb(next);
  };

  const saveFixtureDetails = async (next) => {
    setFixtureDetails(next);
    try { await window.storage.set('fixture-details', JSON.stringify(next), true); }
    catch (e) { setFError('Saved locally only — check your connection.'); }
    scheduleBackup(next);
  };

  // Captain: bulk-import match details from pasted JSON. Fixtures are matched by
  // name (an ad hoc fixture is created if none exists); days are merged by
  // dateLabel so existing days for a fixture are preserved. Saves via the normal
  // path (which snapshots a backup first), so an import is undoable.
  const importMatchDetails = async () => {
    setImportMsg('');
    const MTHS = ['january','february','march','april','may','june','july','august','september','october','november','december'];
    const dayOrder = (d) => {
      const lbl = (d.dateLabel || '').toLowerCase();
      const dayNum = parseInt((lbl.match(/\d+/) || ['99'])[0], 10);
      const mi = MTHS.findIndex(m => lbl.includes(m));
      return (mi < 0 ? 99 : mi) * 100 + (isNaN(dayNum) ? 99 : dayNum);
    };
    let payload;
    try { payload = JSON.parse(importText); }
    catch (e) { setImportMsg('That is not valid JSON — check you pasted the whole block.'); return; }
    const entries = Array.isArray(payload) ? payload
      : (Array.isArray(payload?.matches) ? payload.matches : null);
    if (!entries || !entries.length) { setImportMsg('Expected a "matches" array in the JSON.'); return; }
    const nextFixtures = fixtures.slice();
    const nextDetails = { ...fixtureDetails };
    let created = 0, updated = 0;
    for (const entry of entries) {
      const fxName = (entry.fixture || '').trim();
      if (!fxName || !Array.isArray(entry.days)) continue;
      let fx = nextFixtures.find(f => f.name.trim().toLowerCase() === fxName.toLowerCase());
      if (!fx) {
        const slug = fxName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'fixture';
        let id = 'adhoc-' + slug;
        const ids = new Set(nextFixtures.map(f => f.id));
        while (ids.has(id)) id = 'adhoc-' + slug + '-' + Math.random().toString(36).slice(2, 5);
        fx = { id, month: entry.month || MONTHS_ORDER[0], date: entry.date || '', name: fxName, level: entry.level || '', adhoc: true };
        nextFixtures.push(fx);
        created++;
      }
      const existing = nextDetails[fx.id] || { days: [] };
      const byLabel = new Map((existing.days || []).map(d => [d.dateLabel, d]));
      entry.days.forEach(d => byLabel.set(d.dateLabel, d));
      const merged = Array.from(byLabel.values()).sort((a, b) => dayOrder(a) - dayOrder(b));
      nextDetails[fx.id] = { ...existing, days: merged };
      updated++;
    }
    if (!updated) { setImportMsg('Nothing to import — each entry needs a "fixture" name and a "days" array.'); return; }
    if (created > 0) await saveFixtures(nextFixtures);
    await saveFixtureDetails(nextDetails);
    setImportMsg(`Imported ${updated} fixture${updated === 1 ? '' : 's'}${created ? ` (${created} newly created)` : ''}. Open the fixture to check.`);
    setImportText('');
  };

  // ── Automatic backups of match details / scores ─────────────────────────
  // Every change is snapshotted so an accidental delete can be undone, even
  // without Point-in-Time Recovery. Snapshots are kept in a single shared
  // Firestore record ('fixture-details-backups') as a capped, timestamped list.
  const MAX_BACKUPS = 20;

  const writeBackup = async (data) => {
    try {
      const dataStr = JSON.stringify(data || {});
      // Skip empty or unchanged snapshots
      if (dataStr === '{}' ) return;
      const existing = await window.storage.get('fixture-details-backups', true);
      let list = existing?.value ? JSON.parse(existing.value) : [];
      if (list.length && JSON.stringify(list[list.length - 1].data) === dataStr) return;
      list.push({ ts: Date.now(), data });
      while (list.length > MAX_BACKUPS) list.shift();
      // Stay comfortably under Firestore's 1MB document limit
      while (list.length > 1 && JSON.stringify(list).length > 800000) list.shift();
      await window.storage.set('fixture-details-backups', JSON.stringify(list), true);
    } catch (e) { /* never let a backup failure break a save */ }
  };

  // Trailing debounce: during a flurry of edits (e.g. live scoring +/- taps)
  // this resets, so we snapshot the final state ~8s after activity stops —
  // one backup per editing session rather than one per tap.
  const scheduleBackup = (data) => {
    if (backupTimerRef.current) clearTimeout(backupTimerRef.current);
    backupTimerRef.current = setTimeout(() => writeBackup(data), 8000);
  };

  const loadBackups = async () => {
    try {
      const b = await window.storage.get('fixture-details-backups', true);
      const list = b?.value ? JSON.parse(b.value) : [];
      setBackups([...list].reverse()); // newest first
    } catch (e) { setBackups([]); }
  };

  const backupSummary = (data) => {
    const ids = Object.keys(data || {});
    let matches = 0;
    ids.forEach(id => (data[id]?.days || []).forEach(d => { matches += (d.matches || []).length; }));
    return `${ids.length} fixture${ids.length === 1 ? '' : 's'}, ${matches} match${matches === 1 ? '' : 'es'}`;
  };

  const restoreBackup = async (snap) => {
    if (!snap) return;
    if (!window.confirm('Restore this backup? It replaces all current match details with this saved version. (Your current version is backed up first, so you can undo.)')) return;
    await writeBackup(fixtureDetails); // snapshot current state first, so restore is itself reversible
    await saveFixtureDetails(snap.data);
    setShowBackups(false);
    window.alert('Match details restored.');
  };

  // --- Live scoring helpers (persist via saveFixtureDetails) ---
  const updLiveMatch = (fixtureId, dayId, matchId, updater) => {
    const fd = fixtureDetails[fixtureId];
    if (!fd) return;
    const nextDays = (fd.days || []).map(d => d.id !== dayId ? d : ({
      ...d,
      matches: (d.matches || []).map(m => m.id !== matchId ? m : updater(m))
    }));
    saveFixtureDetails({ ...fixtureDetails, [fixtureId]: { ...fd, days: nextDays } });
  };
  const bumpTeamScore = (fixtureId, dayId, matchId, teamKey, delta) => {
    updLiveMatch(fixtureId, dayId, matchId, m => {
      const key = teamKey === 'teamA' ? 'scoreA' : 'scoreB';
      const cur = m[key] == null ? 0 : Number(m[key]);
      return { ...m, [key]: Math.max(0, cur + delta) };
    });
  };
  const bumpPlayerGoals = (fixtureId, dayId, matchId, teamKey, playerIdx, delta) => {
    updLiveMatch(fixtureId, dayId, matchId, m => {
      const team = m[teamKey] || { players: [] };
      let applied = 0; // actual change after flooring the player's goals at 0
      const players = (team.players || []).map((p, i) => {
        if (i !== playerIdx) return p;
        const cur = p.goals == null ? 0 : Number(p.goals);
        const next = Math.max(0, cur + delta);
        applied = next - cur;
        return { ...p, goals: next };
      });
      // A goal credited to a player also counts on that team's scoreline.
      const scoreKey = teamKey === 'teamA' ? 'scoreA' : 'scoreB';
      const curScore = m[scoreKey] == null ? 0 : Number(m[scoreKey]);
      const nextScore = Math.max(0, curScore + applied);
      return { ...m, [teamKey]: { ...team, players }, [scoreKey]: nextScore };
    });
  };

  // --- Live handicap head-start (HPA handicap-conditions formula) ---
  // The goal difference between the two teams is multiplied by the number of
  // chukkas being played (normally 4), then divided by 6 — the number of
  // chukkas in National and International matches, which the handicap system is
  // based on. That is the number of goals given to the lower-handicap team.
  // Any fraction of a goal is counted as half a goal.
  //   e.g. 2-goal diff over 4 chukkas = (2*4)/6 = 1.5; 1-goal diff = (1*4)/6 = 0.5;
  //        3-goal diff = (3*4)/6 = 2; 2-goal diff over 2 chukkas = (2*2)/6 = 0.5.
  const matchChukkas = (match) => {
    const n = Number(match && match.chukkas);
    return Number.isFinite(n) && n > 0 ? n : 4; // matches default to 4 chukkas
  };
  const liveHeadStart = (match, teamKey) => {
    const hA = Number(match && match.teamA && match.teamA.handicap) || 0;
    const hB = Number(match && match.teamB && match.teamB.handicap) || 0;
    if (hA === hB) return 0;
    const units = Math.abs(hA - hB) * matchChukkas(match); // goal diff * chukkas
    const whole = Math.floor(units / 6);
    const goals = whole + (units % 6 > 0 ? 0.5 : 0); // divide by 6; any fraction → half a goal
    const lower = hA < hB ? 'A' : 'B';
    return teamKey === lower ? goals : 0;
  };
  const fmtHalf = (n) => {
    const whole = Math.floor(n);
    const half = (n - whole) >= 0.5;
    if (half) return whole === 0 ? '½' : whole + '½';
    return String(whole);
  };
  const liveDisplayScore = (match, teamKey) => {
    const goals = teamKey === 'A' ? (match && match.scoreA) : (match && match.scoreB);
    return fmtHalf((Number(goals) || 0) + liveHeadStart(match, teamKey));
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
    const opening = expandedId === id ? null : id;
    setExpandedId(opening);
    setShowTeamForm(false);
    if (opening) {
      const fx = fixtures.find(f => f.id === opening);
      if (fx) resetTeamForm(fx);
    }
  };

  // ── Tournament team sign-up ───────────────────────────
  const saveTeamSignups = async (next) => {
    setTeamSignups(next);
    try { await window.storage.set('team-signups', JSON.stringify(next), true); }
    catch (e) { setTError('Saved locally only — check your connection.'); }
  };

  // Every team name we know about — from the persisted teams-db, from teams in
  // published match details, and from teams already entered into any fixture.
  // Used to autofill the team name + its last squad.
  const knownTeams = () => {
    const map = {}; // lower → { name, handicap, players }
    Object.values(teamsDb).forEach(t => {
      if (t?.name?.trim()) map[t.name.trim().toLowerCase()] = { name: t.name.trim(), handicap: t.handicap ?? null, players: t.players || [] };
    });
    Object.values(fixtureDetails).forEach(det => (det?.days || []).forEach(d => (d.matches || []).forEach(m => ['teamA', 'teamB'].forEach(tk => {
      const t = m[tk];
      if (t?.name?.trim() && t.name.trim().toUpperCase() !== 'TBC') {
        map[t.name.trim().toLowerCase()] = { name: t.name.trim(), handicap: t.handicap ?? null, players: cleanSquad(t.players) };
      }
    }))));
    Object.values(teamSignups).forEach(arr => (arr || []).forEach(s => {
      if (s?.team?.trim()) {
        const key = s.team.trim().toLowerCase();
        if (!map[key]) {
          const firstSquad = Object.values(s.days || {}).find(a => a && a.length) || [];
          map[key] = { name: s.team.trim(), handicap: s.handicap ?? null, players: firstSquad };
        }
      }
    }));
    return map;
  };

  // Reset the working team form to blank 4-player squads for this fixture's days.
  const resetTeamForm = (fx) => {
    const blank = {};
    fixtureDays(fx).forEach(d => {
      blank[d.key] = [{ name: '', handicap: '' }, { name: '', handicap: '' }, { name: '', handicap: '' }, { name: '', handicap: '' }];
    });
    setTSquads(blank);
    setTName(''); setTHandicap(''); setTContact(''); setTMobile(''); setTPerDay(false); setTError('');
  };

  // Autofill the squad(s) when the typed/selected team name matches a known team.
  const onTeamNameChange = (fx, value) => {
    setTName(value);
    const match = knownTeams()[value.trim().toLowerCase()];
    if (!match) return;
    if (match.handicap !== null && match.handicap !== undefined) setTHandicap(String(match.handicap));
    const players = (match.players || []).filter(p => p.name?.trim())
      .map(p => ({ name: p.name, handicap: (p.handicap === 0 || p.handicap) ? String(p.handicap) : '' }));
    if (!players.length) return;
    setTSquads(prev => {
      const next = { ...prev };
      fixtureDays(fx).forEach(d => { next[d.key] = players.map(p => ({ ...p })); });
      return next;
    });
  };

  const setSquadPlayer = (dayKey, idx, field, value) =>
    setTSquads(prev => ({ ...prev, [dayKey]: (prev[dayKey] || []).map((r, i) => i === idx ? { ...r, [field]: value } : r) }));
  const addSquadPlayer = (dayKey) =>
    setTSquads(prev => ({ ...prev, [dayKey]: [...(prev[dayKey] || []), { name: '', handicap: '' }] }));
  const removeSquadPlayer = (dayKey, idx) =>
    setTSquads(prev => ({ ...prev, [dayKey]: (prev[dayKey] || []).filter((_, i) => i !== idx) }));

  const registerTeam = (fx) => {
    setTError('');
    if (!tName.trim()) return setTError('Please enter a team name.');
    const days = fixtureDays(fx);
    const cleanRows = (rows) => (rows || [])
      .map(r => ({ name: (r.name || '').trim(), handicap: r.handicap === '' || r.handicap == null ? null : parseInt(r.handicap, 10) }))
      .filter(r => r.name);
    const usePerDay = tPerDay && days.length > 1;
    const daysOut = {};
    if (usePerDay) {
      days.forEach(d => { daysOut[d.key] = cleanRows(tSquads[d.key]); });
    } else {
      const base = cleanRows(tSquads[days[0].key]);
      days.forEach(d => { daysOut[d.key] = base.map(p => ({ ...p })); });
    }
    if (!Object.values(daysOut).some(arr => arr.length)) return setTError('Add at least one player to the squad.');
    const entry = {
      id: Date.now(),
      team: tName.trim(),
      handicap: tHandicap === '' ? null : parseInt(tHandicap, 10),
      perDay: usePerDay,
      days: daysOut,
    };
    if (tContact.trim()) entry.contact = tContact.trim();
    if (tMobile.trim()) entry.mobile = tMobile.trim();
    const list = teamSignups[fx.id] || [];
    saveTeamSignups({ ...teamSignups, [fx.id]: [...list, entry] });
    // Remember this team (fullest day's squad) so it autofills next time.
    const canonical = Object.values(daysOut).reduce((best, arr) => arr.length > best.length ? arr : best, []);
    saveTeamsDb({ ...teamsDb, [entry.team.toLowerCase()]: { name: entry.team, handicap: entry.handicap, players: canonical } });
    resetTeamForm(fx);
    setShowTeamForm(false);
  };

  const removeTeam = (fixtureId, entryId) => {
    const list = (teamSignups[fixtureId] || []).filter(s => s.id !== entryId);
    const next = { ...teamSignups };
    if (list.length === 0) delete next[fixtureId]; else next[fixtureId] = list;
    saveTeamSignups(next);
  };

  // ── Captain: add / edit / delete fixtures ─────────────────
  const saveFixtures = async (next) => {
    // Never persist before the Firestore list has loaded — writing the built-in
    // seed over a real (edited) list would resurrect deleted fixtures for everyone.
    if (!fixturesLoadedRef.current) return;
    setFixtures(next);
    try { await window.storage.set('fixtures', JSON.stringify(next), true); }
    catch (e) { setFError('Saved locally only — check your connection.'); }
  };
  const openAddFixture = () => { setFError(''); setFixtureEditor({ month: MONTHS_ORDER[0], date: '', name: '', level: '' }); };
  const openEditFixture = (fx) => { setFError(''); setFixtureEditor({ id: fx.id, month: fx.month, date: fx.date, name: fx.name, level: fx.level || '' }); };
  const setEd = (field, value) => setFixtureEditor(prev => prev ? { ...prev, [field]: value } : prev);
  const saveFixtureEditor = () => {
    const ed = fixtureEditor;
    if (!ed) return;
    if (!ed.name.trim()) { setFError('Please enter a fixture name.'); return; }
    if (!ed.date.trim()) { setFError('Please enter a date, e.g. “Sat 30 & Sun 31 May”.'); return; }
    setFError('');
    const clean = { month: ed.month, date: ed.date.trim(), name: ed.name.trim(), level: ed.level.trim() };
    let next;
    if (ed.id) {
      next = fixtures.map(f => f.id === ed.id ? { ...f, ...clean } : f);
    } else {
      const slug = clean.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'fixture';
      const existing = new Set(fixtures.map(f => f.id));
      let id = 'adhoc-' + slug;
      while (existing.has(id)) id = 'adhoc-' + slug + '-' + Math.random().toString(36).slice(2, 5);
      next = [...fixtures, { id, ...clean, adhoc: true }];
    }
    saveFixtures(next);
    setFixtureEditor(null);
  };
  const deleteFixture = (id) => {
    if (!window.confirm('Delete this fixture from the list? Any match details and team sign-ups stay stored, but the fixture will no longer be shown.')) return;
    saveFixtures(fixtures.filter(f => f.id !== id));
    setFixtureEditor(null);
  };
  const restoreOfficialFixtures = () => {
    if (!window.confirm('Restore the official 2026 fixture list? This replaces the current list, including any fixtures you have added or edited.')) return;
    saveFixtures(FIXTURES_2026);
    setFixtureEditor(null);
  };
  const renderFixtureEditor = () => {
    if (!fixtureEditor) return null;
    return (
      <div className="register-form" style={{ marginTop: 0 }}>
        <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '10px' }}>{fixtureEditor.id ? 'Edit fixture' : 'Add fixture'}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input className="input-field" type="text" placeholder="Fixture name e.g. The Rabbit Cup" value={fixtureEditor.name} onChange={e => setEd('name', e.target.value)} style={{ padding: '12px 14px', fontSize: '15px' }} />
          <div style={{ display: 'flex', gap: '8px' }}>
            <select className="input-field select-field" value={fixtureEditor.month} onChange={e => setEd('month', e.target.value)} style={{ width: '136px', flexShrink: 0, padding: '12px 8px', fontSize: '14px' }}>
              {ALL_MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
            <input className="input-field" type="text" placeholder="Date e.g. Sat 30 & Sun 31 May" value={fixtureEditor.date} onChange={e => setEd('date', e.target.value)} style={{ flex: 1, minWidth: 0, padding: '12px 14px', fontSize: '14px' }} />
          </div>
          <input className="input-field" type="text" placeholder="Handicap level e.g. −4 to 0 Goal (optional)" value={fixtureEditor.level} onChange={e => setEd('level', e.target.value)} style={{ padding: '12px 14px', fontSize: '15px' }} />
          <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.45, marginTop: '-2px' }}>
            Put the weekday + day in the date (e.g. “Sat 30 & Sun 31 May”) so team sign-ups and the programme pick up the right days. The handicap level prints on the programme PDF.
          </div>
          {fError && <div style={{ fontSize: '12px', color: 'var(--danger)', padding: '8px 12px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)' }}>{fError}</div>}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-primary" onClick={saveFixtureEditor} style={{ flex: 1, padding: '13px', fontSize: '12px' }}>{fixtureEditor.id ? 'Save fixture' : 'Add fixture'}</button>
            <button onClick={() => { setFixtureEditor(null); setFError(''); }} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '13px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
          </div>
          {fixtureEditor.id && (
            <button onClick={() => deleteFixture(fixtureEditor.id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Delete fixture</button>
          )}
        </div>
      </div>
    );
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
        .team-entry {
          padding: 10px 12px;
          margin-bottom: 8px;
          background: white;
          border: 1px solid var(--line);
          border-left: 3px solid var(--burgundy);
          border-radius: 4px;
        }
        .squad-line {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-top: 6px;
        }
        .squad-day {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--burgundy);
          font-weight: 600;
          width: 100%;
          margin-bottom: 1px;
        }
        .squad-chip {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--cream-warm);
          border: 1px solid var(--line);
          border-radius: 999px;
          padding: 3px 10px;
          font-size: 12.5px;
          color: var(--ink);
        }
        .squad-chip em {
          font-style: normal;
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 11px;
          color: var(--burgundy);
        }
        .enter-team-btn {
          width: 100%;
          margin-top: 8px;
          padding: 12px;
          background: transparent;
          border: 1px dashed var(--gold);
          border-radius: 4px;
          color: var(--burgundy);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          cursor: pointer;
        }
        .enter-team-btn:hover { background: var(--cream-warm); }
        .perday-toggle {
          display: flex;
          gap: 6px;
        }
        .perday-toggle button {
          flex: 1;
          padding: 9px 6px;
          background: transparent;
          border: 1px solid var(--line);
          border-radius: 4px;
          color: var(--muted);
          font-size: 11.5px;
          font-weight: 600;
          cursor: pointer;
        }
        .perday-toggle button.active {
          background: var(--burgundy);
          color: var(--cream);
          border-color: var(--burgundy);
        }
        .squad-editor {
          padding: 10px;
          background: var(--cream-pale);
          border: 1px solid var(--line);
          border-radius: 4px;
        }
        .squad-editor-head {
          font-size: 10px;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: var(--burgundy);
          font-weight: 600;
          margin-bottom: 8px;
        }
        .squad-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
        }
        .add-player-btn {
          background: transparent;
          border: none;
          color: var(--burgundy);
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 2px 0;
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
            Thu ♀
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
          <button className={`tab-btn ${activeTab === 'live' ? 'active' : ''}`} onClick={() => setActiveTab('live')}>
            Live Game
          </button>
          {captainMode && (
            <button className={`tab-btn ${activeTab === 'players' ? 'active' : ''}`} onClick={() => setActiveTab('players')}>
              Players
            </button>
          )}
        </nav>

        <main style={{ maxWidth: '540px', margin: '0 auto', padding: '24px 16px 60px' }}>

          {/* ─── DAY CHUKKAS TABS (Wed/Thu/Sat/Sun) ─── */}
          {DAY_KEYS.includes(activeTab) && (
            <div className="reveal">
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div className="label-eyebrow">
                  {activeDayConfig.note
                    ? <>{activeDayConfig.note} · {fmtTime(throwInMin)}</>
                    : <>{activeDayConfig.fullLabel}s · {fmtTime(throwInMin)}</>
                  }
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
                {activeDayConfig.note && (
                  <div className="display-italic" style={{ fontSize: '14px', color: 'var(--burgundy)', marginTop: '4px' }}>
                    {activeDayConfig.note}
                  </div>
                )}
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

                  {/* No consecutive — any player can set this for themselves */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink)', padding: '14px', background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '4px' }}>
                    <input
                      type="checkbox"
                      checked={noConsecutive}
                      onChange={(e) => setNoConsecutive(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--burgundy)', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <div>
                      <span style={{ fontWeight: 600 }}>No consecutive chukkas</span>
                      <span style={{ color: 'var(--muted)', marginLeft: '6px', fontSize: '12px' }}>Always leaves a gap of at least one chukka between plays</span>
                    </div>
                  </label>

                  {/* Pony hire — affects price (own-pony players leave unticked) */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink)', padding: '14px', background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '4px' }}>
                    <input
                      type="checkbox"
                      checked={ponyHire}
                      onChange={(e) => setPonyHire(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: 'var(--burgundy)', cursor: 'pointer', flexShrink: 0 }}
                    />
                    <div>
                      <span style={{ fontWeight: 600 }}>Hire a pony</span>
                      <span style={{ color: 'var(--muted)', marginLeft: '6px', fontSize: '12px' }}>Adds pony hire to your cost. Leave unticked if you bring your own.</span>
                    </div>
                  </label>

                  {(() => {
                    const c = parseInt(chukkas, 10);
                    if (!name.trim() || !c || c < 1) return null;
                    const rec = playerDb.find(p => (p.name || '').trim().toLowerCase() === name.trim().toLowerCase());
                    const subject = rec || { membership: 'none', military: false, subsidies: [] };
                    const bd = priceBooking(subject, c, ponyHire ? 'club' : 'none');
                    return (
                      <div style={{ fontSize: '12px', color: bd.freeToRoster ? 'var(--burgundy)' : 'var(--ink)', padding: '10px 14px', background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '4px', lineHeight: 1.5 }}>
                        {bd.freeToRoster
                          ? `No charge for ${c} chukka${c === 1 ? '' : 's'}${ponyHire ? '' : ' (own pony)'} — you'll be added to the roster.`
                          : <>Estimated cost: <strong>£{fmtMoney(bd.total)}</strong> for {c} chukka{c === 1 ? '' : 's'} ({ponyHire ? 'with pony hire' : 'no pony hire'}). Payable to the Captain.</>}
                        {!rec && <span style={{ color: 'var(--muted)' }}> (estimate assumes non-member rates)</span>}
                      </div>
                    );
                  })()}
                  {captainMode && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '14px', background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '4px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '2px', fontFamily: "'Fraunces', serif", fontStyle: 'italic' }}>
                        Captain options
                      </div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', color: 'var(--ink)' }}>
                        <input
                          type="checkbox"
                          checked={vip}
                          onChange={(e) => setVip(e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: 'var(--burgundy)', cursor: 'pointer', flexShrink: 0 }}
                        />
                        <div>
                          <span style={{ fontWeight: 600 }}>VIP</span>
                          <span style={{ color: 'var(--muted)', marginLeft: '6px', fontSize: '12px' }}>Placed first · chukka count never reduced below request</span>
                        </div>
                      </label>
                    </div>
                  )}

                  {error && (
                    <div style={{ fontSize: '13px', color: 'var(--danger)', padding: '10px 14px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)' }}>
                      {error}
                    </div>
                  )}

                  {bookingMsg && (
                    <div style={{ fontSize: '13px', color: 'var(--burgundy)', padding: '10px 14px', background: 'var(--cream-pale)', borderRadius: '4px', borderLeft: '3px solid var(--gold)', lineHeight: 1.5 }}>
                      {bookingMsg}
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
                            <div style={{ fontWeight: 500, fontSize: '16px', wordBreak: 'break-word' }}>{p.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                              {availLabel && <span className="pref-tag">{availLabel}</span>}
                              {p.vip && <span style={{ fontSize: '10px', background: 'var(--gold)', color: 'var(--burgundy-deep)', padding: '1px 6px', borderRadius: '8px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>VIP</span>}
                              {p.noConsecutive && <span style={{ fontSize: '10px', background: 'var(--cream-warm)', color: 'var(--muted)', padding: '1px 6px', borderRadius: '8px', border: '1px solid var(--line)', letterSpacing: '0.3px' }}>no consec.</span>}
                              {captainMode && (
                                <>
                                  <button
                                    type="button"
                                    title={p.vip ? 'Remove VIP' : 'Mark as VIP'}
                                    onClick={() => toggleVip(p.id)}
                                    style={{
                                      background: p.vip ? 'var(--gold)' : 'transparent',
                                      border: '1px solid ' + (p.vip ? 'var(--gold)' : 'var(--line)'),
                                      color: p.vip ? 'var(--burgundy-deep)' : 'var(--muted)',
                                      borderRadius: '10px', padding: '1px 7px',
                                      fontSize: '10px', fontWeight: 700,
                                      letterSpacing: '0.5px', textTransform: 'uppercase',
                                      cursor: 'pointer', flexShrink: 0,
                                    }}
                                  >VIP</button>
                                  <button
                                    type="button"
                                    title={p.noConsecutive ? 'Remove no-consecutive' : 'Enable no-consecutive'}
                                    onClick={() => toggleNoConsecutive(p.id)}
                                    style={{
                                      background: p.noConsecutive ? 'var(--cream-warm)' : 'transparent',
                                      border: '1px solid var(--line)',
                                      color: p.noConsecutive ? 'var(--ink)' : 'var(--muted)',
                                      borderRadius: '10px', padding: '1px 7px',
                                      fontSize: '10px', letterSpacing: '0.3px',
                                      cursor: 'pointer', flexShrink: 0,
                                    }}
                                  >no⁻</button>
                                </>
                              )}
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
                      <strong>Reduced:</strong>{' '}
                      {schedule.reduced.map(r => `${r.player.name} (wanted ${r.requested}, playing ${r.given})`).join(', ')}
                      <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85 }} className="display-italic">
                        Late signups give way to players who booked earlier.
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
                            {ck.playerCount} player{ck.playerCount === 1 ? '' : 's'} — plays as {teamAFour}v{teamBFour}.
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
                  Tap a fixture to enter a team or register your interest, and see who else has signed up.
                </div>
                {totalRegistrations > 0 && (
                  <div style={{ fontSize: '12px', color: 'var(--burgundy)', marginTop: '8px', fontWeight: 500 }}>
                    {totalRegistrations} {totalRegistrations === 1 ? 'registration' : 'registrations'} across the season
                  </div>
                )}
              </div>

              {captainMode && (
                <div style={{ maxWidth: '480px', margin: '0 auto 16px', border: '1px solid var(--line)', borderRadius: '6px', padding: '8px 12px' }}>
                  <button
                    onClick={() => { const n = !showBackups; setShowBackups(n); if (n) loadBackups(); }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--burgundy)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', padding: '4px' }}>
                    {showBackups ? 'Hide backups' : '↺ Restore match details from backup'}
                  </button>
                  {showBackups && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Backups save automatically whenever match details or scores change. Pick a point to roll back to — your current version is saved first, so a restore can itself be undone.
                      </div>
                      {backups.length === 0 ? (
                        <div style={{ fontSize: '12px', color: 'var(--muted)', padding: '6px 0' }}>No backups yet — they’ll appear here after the next change.</div>
                      ) : backups.map((b) => (
                        <div key={b.ts} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '6px 0', borderTop: '1px solid var(--line)' }}>
                          <div style={{ fontSize: '12px', color: 'var(--ink)' }}>
                            <div style={{ fontWeight: 600 }}>{new Date(b.ts).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{backupSummary(b.data)}</div>
                          </div>
                          <button onClick={() => restoreBackup(b)} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>Restore</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {captainMode && (
                <div style={{ maxWidth: '480px', margin: '0 auto 16px', border: '1px solid var(--line)', borderRadius: '6px', padding: '8px 12px' }}>
                  <button
                    onClick={() => { setShowImport(v => !v); setImportMsg(''); }}
                    style={{ width: '100%', background: 'transparent', border: 'none', color: 'var(--burgundy)', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', padding: '4px' }}>
                    {showImport ? 'Hide import' : 'Import match details (paste JSON)'}
                  </button>
                  {showImport && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '8px', lineHeight: 1.5 }}>
                        Paste a match-details JSON block. Fixtures are matched by name (a new one is created if it doesn’t exist yet) and days are merged, so existing details aren’t lost. A backup is saved first, so this can be undone.
                      </div>
                      <textarea
                        value={importText}
                        onChange={e => setImportText(e.target.value)}
                        placeholder='{ "matches": [ … ] }'
                        style={{ width: '100%', minHeight: '120px', fontFamily: 'monospace', fontSize: '11px', padding: '8px', borderRadius: '4px', border: '1px solid var(--line)', boxSizing: 'border-box' }}
                      />
                      {importMsg && <div style={{ fontSize: '11px', color: 'var(--burgundy)', margin: '6px 0', lineHeight: 1.4 }}>{importMsg}</div>}
                      <button onClick={importMatchDetails} disabled={!importText.trim()} style={{ marginTop: '6px', background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: importText.trim() ? 'pointer' : 'default', opacity: importText.trim() ? 1 : 0.5 }}>Import</button>
                    </div>
                  )}
                </div>
              )}

              {captainMode && (
                <div style={{ maxWidth: '480px', margin: '0 auto 16px' }}>
                  {fixtureEditor && !fixtureEditor.id ? renderFixtureEditor() : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={openAddFixture} style={{ flex: 1, background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>＋ Add fixture</button>
                      <button onClick={restoreOfficialFixtures} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '10px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>↺ Official list</button>
                    </div>
                  )}
                </div>
              )}

              {ALL_MONTHS.filter(m => fixtures.some(f => f.month === m)).map(month => {
                const monthFixtures = fixtures.filter(f => f.month === month);
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
                      const teamsHere = teamSignups[fx.id] || [];
                      const fxDays = fixtureDays(fx);
                      const isExpanded = expandedId === fx.id;
                      return (
                        <div key={fx.id} data-fixture-id={fx.id} className={`fixture-card ${isExpanded ? 'expanded' : ''}`}>
                          <div className="fixture-header" onClick={() => toggleFixture(fx.id)}>
                            <div className="fixture-date">{fx.date}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div className="fixture-name">{fx.name}</div>
                              {fx.level && <div className="fixture-level">{fx.level}</div>}
                            </div>
                            <div className="fixture-meta">
                              {teamsHere.length > 0 ? (
                                <>
                                  <div className="fixture-count">{teamsHere.length}</div>
                                  <div>{teamsHere.length === 1 ? 'team' : 'teams'}</div>
                                </>
                              ) : registered.length > 0 ? (
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
                              {captainMode && (fixtureEditor?.id === fx.id ? (
                                <div style={{ paddingTop: '12px' }}>{renderFixtureEditor()}</div>
                              ) : (
                                <div style={{ paddingTop: '10px', textAlign: 'right' }}>
                                  <button onClick={() => openEditFixture(fx)} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--burgundy)', padding: '5px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}>✎ Edit fixture{fx.adhoc ? ' (ad hoc)' : ''}</button>
                                </div>
                              ))}
                              {/* ── Fixture match details ── */}
                              {(() => {
                                const det = fixtureDetails[fx.id];
                                const isEditingThis = captainMode && editingDetailsId === fx.id;
                                if (!det && !captainMode) return null;
                                const fmtHcp = (h) => h === null || h === undefined ? '' : (h > 0 ? ' +' + h : h < 0 ? ' ' + h : ' 0');
                                return (
                                  <div style={{ marginBottom: '14px' }}>
                                    {det && det.days && det.days.map((day, di) => (
                                      <div key={di} style={{ marginBottom: '18px' }}>
                                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                                          <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--ink)', marginBottom: '2px' }}>{day.dateLabel}</div>
                                          {day.ground && <div style={{ fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>{day.ground}</div>}
                                        </div>
                                        {(day.matches || []).map((match, mi) => (
                                          <div key={mi} style={{ marginBottom: '14px', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                                            <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                                              <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: '17px', textDecoration: 'underline', color: 'var(--ink)' }}>
                                                {match.time}{match.label ? ` ${match.label.toUpperCase()}` : ''}
                                              </div>
                                              {(match.teamA?.name || match.teamB?.name) && (
                                                <div style={{ fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px', margin: '3px 0 2px', color: 'var(--ink)', textTransform: 'uppercase' }}>
                                                  {match.teamA?.name || 'TBC'} V {match.teamB?.name || 'TBC'}
                                                </div>
                                              )}
                                                {(match.scoreA != null || match.scoreB != null) && (
                                                  <div style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '0.5px', margin: '1px 0 3px', color: 'var(--burgundy)' }}>
                                                    {match.scoreA ?? 0} &ndash; {match.scoreB ?? 0}
                                                  </div>
                                                )}
                                              {match.umpires && (
                                                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Umpires: {match.umpires}</div>
                                              )}
                                              {match.goalJudges && (
                                                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Goal judges: {match.goalJudges}</div>
                                              )}
                                              {match.timekeeper && (
                                                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Timekeeper: {match.timekeeper}</div>
                                              )}
                                            </div>
                                            {((match.teamA?.players?.length > 0) || (match.teamB?.players?.length > 0)) && (
                                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 12px' }}>
                                                {[match.teamA, match.teamB].map((team, ti) => team && (
                                                  <div key={ti} style={{ textAlign: 'center' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '11px', letterSpacing: '0.3px', marginBottom: '3px', textTransform: 'uppercase' }}>
                                                      {team.name}{fmtHcp(team.handicap)}
                                                    </div>
                                                    {(team.players || []).map((pl, pi) => (
                                                      <div key={pi} style={{ fontSize: '11px', color: 'var(--ink)', lineHeight: 1.4 }}>
                                                        {pl.name}{fmtHcp(pl.handicap)}
                                                      </div>
                                                    ))}
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                            {match.notes && (
                                              <div style={{ fontSize: '10px', color: 'var(--muted)', textAlign: 'center', marginTop: '8px', fontStyle: 'italic', lineHeight: 1.5 }}>{match.notes}</div>
                                            )}
                                          </div>
                                        ))}
                                        {day.prizegiving && (
                                          <div style={{ textAlign: 'center', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--line)' }}>
                                            <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: '14px', textDecoration: 'underline', letterSpacing: '1px', color: 'var(--ink)', textTransform: 'uppercase' }}>
                                              {typeof day.prizegiving === 'string' && day.prizegiving.trim() ? `${day.prizegiving} · Prizegiving` : 'Prizegiving'}
                                            </div>
                                          </div>
                                        )}
                                        {captainMode && det && (
                                          <button
                                            onClick={async () => {
                                              try { await generateTournamentPdf(fx, det); }
                                              catch (err) { alert('Could not generate PDF: ' + (err?.message || err)); }
                                            }}
                                            style={{ marginTop: '12px', width: '100%', background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
                                            ↓ Download programme PDF
                                          </button>
                                        )}
                                      </div>
                                    ))}
                                    {captainMode && !isEditingThis && (
                                      <button onClick={() => setEditingDetailsId(fx.id)} style={{ width: '100%', background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted)', padding: '7px', borderRadius: '4px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '10px' }}>
                                        {det ? 'Edit match details' : '+ Add match details'}
                                      </button>
                                    )}
                                    {isEditingThis && (() => {
                                      const draft = fixtureDetails[fx.id] || { days: [] };
                                      const setDraft = (next) => { saveFixtureDetails({ ...fixtureDetails, [fx.id]: next }); };
                                      const updDay = (di, updater) => { const days = draft.days.map((d,i) => i===di ? updater(d) : d); setDraft({...draft, days}); };
                                      const updMatch = (di, mi, updater) => { updDay(di, d => ({...d, matches: d.matches.map((m,i) => i===mi ? updater(m) : m)})); };
                                      const updTeam = (di, mi, tk, updater) => { updMatch(di, mi, m => ({...m, [tk]: updater(m[tk] || {})})); };
                              // Combined team lookup: persisted teamsDb + teams in current draft days
                              const allTeams = (() => {
                                const map = { ...teamsDb };
                                (draft.days || []).forEach(day => {
                                  (day.matches || []).forEach(m => {
                                    ['teamA', 'teamB'].forEach(tk2 => {
                                      const t = m[tk2];
                                      if (t?.name?.trim()) {
                                        const k = t.name.trim().toLowerCase();
                                        if (!map[k] || (t.players?.length && (!map[k].players?.length))) {
                                          map[k] = { name: t.name.trim(), handicap: t.handicap ?? null, players: cleanSquad(t.players) };
                                        }
                                      }
                                    });
                                  });
                                });
                                return map;
                              })();
                                      // Teams that have signed up for THIS fixture — folded into the team
                                      // picker below so the captain can draw matches straight from sign-ups.
                                      const enteredTeams = teamSignups[fx.id] || [];
                                      const squadForDay = (signup, dayObj) => {
                                        const sd = signup.days || {};
                                        if (dayObj?.id && sd[dayObj.id]) return sd[dayObj.id];
                                        const lbl = (dayObj?.dateLabel || '').toLowerCase();
                                        const byLabel = Object.keys(sd).find(k => {
                                          const full = WEEKDAY_FULL[k.replace(/\d+$/, '')];
                                          return full && lbl.includes(full.toLowerCase());
                                        });
                                        if (byLabel) return sd[byLabel];
                                        return Object.values(sd).reduce((best, arr) => (arr && arr.length > best.length ? arr : best), []);
                                      };
                                      // One-tap scaffold: create a day block per fixture day (pre-labelled and
                                      // keyed so the day-aware fill matches automatically), pairing the entered
                                      // teams into draft matches with their per-day squads dropped in.
                                      const buildDaysFromEntered = () => {
                                        if (!enteredTeams.length) return;
                                        const fxd = fixtureDays(fx);
                                        const hasContent = (draft.days || []).some(d => (d.matches || []).length > 0 || (d.dateLabel || '').trim() || (d.ground || '').trim());
                                        if (hasContent && !window.confirm('Replace the current match details with days and matches built from the entered teams? Your current version is saved to backups first, so you can undo from the Fixtures screen.')) return;
                                        const START_MIN = 10 * 60; // first match 10:00
                                        const STEP_MIN = 75;        // 1h15 between matches
                                        const mkTeam = (s, d) => s
                                          ? { name: s.team, handicap: s.handicap ?? null, players: cleanSquad(squadForDay(s, { id: d.key, dateLabel: d.label })) }
                                          : { name: 'TBC', handicap: null, players: [] };
                                        const newDays = fxd.map(d => {
                                          const matches = [];
                                          for (let i = 0; i < enteredTeams.length; i += 2) {
                                            matches.push({
                                              id: 'm' + Date.now() + '-' + d.key + '-' + i + '-' + Math.random().toString(36).slice(2, 6),
                                              time: fmtTime(START_MIN + matches.length * STEP_MIN),
                                              label: '',
                                              teamA: mkTeam(enteredTeams[i], d),
                                              teamB: mkTeam(enteredTeams[i + 1], d),
                                              chukkas: 4, umpires: '', goalJudges: '', timekeeper: '', notes: '',
                                            });
                                          }
                                          return { id: d.key, dateLabel: d.label, ground: '', matches, prizegiving: false };
                                        });
                                        if (newDays.length) newDays[newDays.length - 1].prizegiving = true;
                                        writeBackup(fixtureDetails); // snapshot current state first so this is undoable
                                        setDraft({ ...draft, days: newDays });
                                      };
                                      return (
                                        <div style={{ background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '6px', padding: '14px', marginBottom: '14px' }}>
                                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                            <div className="label-eyebrow" style={{ fontSize: '10px' }}>Match details</div>
                                            <button onClick={() => setEditingDetailsId(null)} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--muted)', cursor: 'pointer', lineHeight: 1, padding: '0 4px' }}>×</button>
                                          </div>
                                          {enteredTeams.length > 0 && (
                                            <button onClick={buildDaysFromEntered} style={{ width: '100%', background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '12px' }}>
                                              ⚡ Build {fixtureDays(fx).length > 1 ? `${fixtureDays(fx).length} days` : 'day'} from {enteredTeams.length} entered team{enteredTeams.length === 1 ? '' : 's'}
                                            </button>
                                          )}
                                          {(draft.days || []).map((day, di) => (
                                            <div key={di} style={{ background: 'white', border: '1px solid var(--line)', borderRadius: '4px', padding: '10px', marginBottom: '10px' }}>
                                              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', alignItems: 'center' }}>
                                                <input className="input-field" placeholder="Day label e.g. Saturday 30th May" value={day.dateLabel || ''} onChange={e => updDay(di, d => ({...d, dateLabel: e.target.value}))} style={{ flex: 2, padding: '7px 10px', fontSize: '12px' }} />
                                                <select className="input-field select-field" value={day.ground || ''} onChange={e => updDay(di, d => ({...d, ground: e.target.value}))} style={{ flex: 1, padding: '7px 10px', fontSize: '12px' }}>
                                                  <option value="">Ground…</option>
                                                  {GROUND_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                                                </select>
                                                <button onClick={() => { const days = draft.days.filter((_,i) => i!==di); setDraft({...draft, days}); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '18px', cursor: 'pointer', flexShrink: 0, lineHeight: 1, padding: '0 4px' }}>×</button>
                                              </div>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}>
                                                  <input type="checkbox" checked={!!day.prizegiving} onChange={e => updDay(di, d => ({...d, prizegiving: e.target.checked ? (typeof d.prizegiving === 'string' && d.prizegiving.trim() ? d.prizegiving : true) : false}))} style={{ width: '16px', height: '16px', accentColor: 'var(--burgundy)' }} />
                                                  Prizegiving
                                                </label>
                                                {!!day.prizegiving && (
                                                  <input className="input-field" placeholder="Time e.g. 14:00 (optional)" value={typeof day.prizegiving === 'string' ? day.prizegiving : ''} onChange={e => updDay(di, d => ({...d, prizegiving: e.target.value}))} style={{ flex: 1, minWidth: '140px', padding: '5px 8px', fontSize: '12px' }} />
                                                )}
                                              </div>
                                              {(day.matches || []).map((match, mi) => (
                                                <div key={mi} style={{ background: 'var(--cream-pale)', border: '1px solid var(--line)', borderRadius: '4px', padding: '8px', marginBottom: '6px' }}>
                                                  <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                                                    <input className="input-field" placeholder="Time" value={match.time || ''} onChange={e => updMatch(di, mi, m => ({...m, time: e.target.value}))} style={{ width: '80px', padding: '5px 7px', fontSize: '12px' }} />
                                                    <input className="input-field" type="number" min="1" placeholder="Ch" title="Chukkas in this match (used for the handicap goal start)" value={match.chukkas ?? ''} onChange={e => updMatch(di, mi, m => ({...m, chukkas: e.target.value === '' ? null : Math.max(1, parseInt(e.target.value, 10) || 1)}))} style={{ width: '48px', padding: '5px 5px', fontSize: '12px', textAlign: 'center' }} />
                                                    <input className="input-field" placeholder="Label e.g. Final" value={match.label || ''} onChange={e => updMatch(di, mi, m => ({...m, label: e.target.value}))} style={{ flex: 1, minWidth: 0, padding: '5px 7px', fontSize: '12px' }} />
                                                    <button onClick={() => { const matches = day.matches.filter((_,i) => i!==mi); updDay(di, d => ({...d, matches})); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '16px', cursor: 'pointer', flexShrink: 0, lineHeight: 1, padding: '0 2px' }}>×</button>
                                                  </div>
                                                  <input className="input-field" placeholder="Umpires" value={match.umpires || ''} onChange={e => updMatch(di, mi, m => ({...m, umpires: e.target.value}))} style={{ width: '100%', padding: '5px 7px', fontSize: '12px', marginBottom: '5px' }} />
                                                  <div style={{ display: 'flex', gap: '6px', marginBottom: '5px' }}>
                                                    <input className="input-field" placeholder="Goal judges" value={match.goalJudges || ''} onChange={e => updMatch(di, mi, m => ({...m, goalJudges: e.target.value}))} style={{ flex: 1, minWidth: 0, padding: '5px 7px', fontSize: '12px' }} />
                                                    <input className="input-field" placeholder="Timekeeper" value={match.timekeeper || ''} onChange={e => updMatch(di, mi, m => ({...m, timekeeper: e.target.value}))} style={{ flex: 1, minWidth: 0, padding: '5px 7px', fontSize: '12px' }} />
                                                  </div>
                                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                                                    <span style={{ fontSize: '11px', color: 'var(--burgundy)', fontWeight: 600, minWidth: '40px' }}>Score</span>
                                                    <input className="input-field" type="number" step="0.5" placeholder="A" value={match.scoreA ?? ''} onChange={e => updMatch(di, mi, m => ({...m, scoreA: e.target.value === '' ? null : Number(e.target.value)}))} style={{ width: '56px', padding: '5px 7px', fontSize: '12px', textAlign: 'center' }} />
                                                    <span style={{ fontSize: '12px', color: '#999' }}>vs</span>
                                                    <input className="input-field" type="number" step="0.5" placeholder="B" value={match.scoreB ?? ''} onChange={e => updMatch(di, mi, m => ({...m, scoreB: e.target.value === '' ? null : Number(e.target.value)}))} style={{ width: '56px', padding: '5px 7px', fontSize: '12px', textAlign: 'center' }} />
                                                  </div>
                                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '4px' }}>
                                                    {[['teamA', 'Team A'], ['teamB', 'Team B']].map(([tk, tl]) => {
                                                      const team = match[tk] || { name: '', handicap: null, players: [] };
                                                      return (
                                                        <div key={tk}>
                                                          <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                                                            <div style={{ position: 'relative', flex: 1 }}>
                                                              <input
                                                                className="input-field"
                                                                placeholder={tl + ' name'}
                                                                value={team.name || ''}
                                                                autoComplete="off"
                                                                autoCorrect="off"
                                                                autoCapitalize="words"
                                                                spellCheck={false}
                                                                onChange={e => {
                                                                  const val = e.target.value;
                                                                  updTeam(di, mi, tk, t => ({...t, name: val, _teamSugOpen: true}));
                                                                }}
                                                                onFocus={() => updTeam(di, mi, tk, t => ({...t, _teamSugOpen: true}))}
                                                                onBlur={() => setTimeout(() => updTeam(di, mi, tk, t => ({...t, _teamSugOpen: false})), 150)}
                                                                style={{ width: '100%', padding: '4px 6px', fontSize: '11px', boxSizing: 'border-box' }}
                                                              />
                                                              {team._teamSugOpen && (() => {
                                                                const q = (team.name || '').trim().toLowerCase();
                                                                const entered = enteredTeams.filter(s => !q || s.team.toLowerCase().includes(q));
                                                                const enteredNames = new Set(entered.map(s => s.team.toLowerCase()));
                                                                const hits = Object.values(allTeams).filter(t => q && t.name.toLowerCase().includes(q) && t.name.toLowerCase() !== q && !enteredNames.has(t.name.toLowerCase()));
                                                                if (!entered.length && !hits.length) return null;
                                                                return (
                                                                  <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--line)', borderRadius: '3px', zIndex: 99, maxHeight: '180px', overflowY: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                                                                    {entered.map(s => {
                                                                      const squad = squadForDay(s, day);
                                                                      return (
                                                                        <div key={'e' + s.id}
                                                                          onMouseDown={e => { e.preventDefault(); updTeam(di, mi, tk, tt => ({...tt, name: s.team, handicap: s.handicap ?? tt.handicap, players: cleanSquad(squad), _teamSugOpen: false})); }}
                                                                          style={{ padding: '6px 8px', fontSize: '11px', cursor: 'pointer', borderBottom: '1px solid var(--line)', lineHeight: 1.3, background: 'var(--cream-warm)' }}
                                                                          onMouseEnter={e => e.currentTarget.style.background='var(--cream)'}
                                                                          onMouseLeave={e => e.currentTarget.style.background='var(--cream-warm)'}
                                                                        >
                                                                          <span style={{ fontWeight: 600 }}>{s.team}</span>
                                                                          <span style={{ fontSize: '8px', color: 'var(--cream)', background: 'var(--burgundy)', borderRadius: '3px', padding: '1px 5px', marginLeft: '6px', textTransform: 'uppercase', letterSpacing: '0.5px', verticalAlign: 'middle' }}>Entered</span>
                                                                          {squad?.length ? <span style={{ color: 'var(--muted)', marginLeft: '4px' }}>{squad.map(p => p.name).join(', ')}</span> : null}
                                                                        </div>
                                                                      );
                                                                    })}
                                                                    {hits.map(t => (
                                                                      <div key={t.name}
                                                                        onMouseDown={e => { e.preventDefault(); updTeam(di, mi, tk, tt => ({...tt, name: t.name, handicap: t.handicap ?? tt.handicap, players: cleanSquad(t.players), _teamSugOpen: false})); }}
                                                                        style={{ padding: '6px 8px', fontSize: '11px', cursor: 'pointer', borderBottom: '1px solid var(--line)', lineHeight: 1.3 }}
                                                                        onMouseEnter={e => e.currentTarget.style.background='var(--cream)'}
                                                                        onMouseLeave={e => e.currentTarget.style.background='white'}
                                                                      >
                                                                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                                                                        {t.players?.length ? <span style={{ color: 'var(--muted)', marginLeft: '4px' }}>{t.players.map(p=>p.name).join(', ')}</span> : null}
                                                                      </div>
                                                                    ))}
                                                                  </div>
                                                                );
                                                              })()}
                                                            </div>
                                                            <input className="input-field" placeholder="HCP" type="number" value={team.handicap !== null && team.handicap !== undefined ? team.handicap : ''} onChange={e => updTeam(di, mi, tk, t => ({...t, handicap: e.target.value === '' ? null : parseInt(e.target.value, 10)}))} style={{ width: '48px', padding: '4px 5px', fontSize: '11px' }} />
                                                          </div>
                                                          {(team.players || []).map((pl, pi) => (
                                                            <div key={pi} style={{ display: 'flex', gap: '3px', marginBottom: '2px' }}>
                                                              <input className="input-field" placeholder="Name" value={pl.name || ''} onChange={e => updTeam(di, mi, tk, t => ({...t, players: t.players.map((p,i) => i===pi ? {...p, name: e.target.value} : p)}))} style={{ flex: 1, padding: '3px 5px', fontSize: '10px' }} />
                                                              <input className="input-field" placeholder="HCP" type="number" value={pl.handicap !== null && pl.handicap !== undefined ? pl.handicap : ''} onChange={e => updTeam(di, mi, tk, t => ({...t, players: t.players.map((p,i) => i===pi ? {...p, handicap: e.target.value === '' ? null : parseInt(e.target.value, 10)} : p)}))} style={{ width: '44px', padding: '3px 5px', fontSize: '10px' }} />
                                                              <input className="input-field" placeholder="G" type="number" step="0.5" value={pl.goals !== null && pl.goals !== undefined ? pl.goals : ''} onChange={e => updTeam(di, mi, tk, t => ({...t, players: t.players.map((p,i) => i===pi ? {...p, goals: e.target.value === '' ? null : parseFloat(e.target.value, 10)} : p)}))} style={{ width: '44px', padding: '3px 5px', fontSize: '10px' }} />
                                                              <button onClick={() => updTeam(di, mi, tk, t => ({...t, players: t.players.filter((_,i) => i!==pi)}))} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: '13px', cursor: 'pointer', lineHeight: 1, padding: '0 1px' }}>×</button>
                                                            </div>
                                                          ))}
                                                          {(team.players||[]).length < 4 && (<button onClick={() => updTeam(di, mi, tk, t => ((t.players||[]).length >= 4 ? t : {...t, players: [...(t.players||[]), {name:'', handicap: null}]}))} style={{ background: 'none', border: 'none', color: 'var(--burgundy)', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.3px', padding: '1px 0' }}>+ player</button>)}
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                  <textarea className="input-field" placeholder="Notes…" value={match.notes || ''} onChange={e => updMatch(di, mi, m => ({...m, notes: e.target.value}))} style={{ width: '100%', padding: '5px 7px', fontSize: '10px', minHeight: '44px', resize: 'vertical' }} />
                                                </div>
                                              ))}
                                              {di > 0 && (draft.days[0]?.matches || []).length > 0 && (
                                                <button onClick={() => {
                                                  const srcDay = draft.days[0];
                                                  const copiedMatches = (srcDay.matches || []).map(m => ({
                                                    ...m,
                                                    id: 'm' + Date.now() + Math.random(),
                                                    time: '',
                                                    label: '',
                                                    chukkas: 4, umpires: '', goalJudges: '', timekeeper: '',
                                                    teamA: { name: m.teamA?.name || '', handicap: m.teamA?.handicap ?? null, players: cleanSquad(m.teamA?.players) },
                                                    teamB: { name: m.teamB?.name || '', handicap: m.teamB?.handicap ?? null, players: cleanSquad(m.teamB?.players) },
                                                  }));
                                                  updDay(di, d => ({...d, matches: copiedMatches}));
                                                }} style={{ width: '100%', background: 'transparent', border: '1px dashed var(--burgundy)', color: 'var(--burgundy)', padding: '5px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.5px', marginBottom: '2px', opacity: 0.75 }}>↩ Copy teams from Day 1</button>
                                              )}
                                              <button onClick={() => updDay(di, d => ({...d, matches: [...(d.matches||[]), {id:'m'+Date.now(), time:'', label:'', teamA:{name:'', handicap:null, players:[]}, teamB:{name:'', handicap:null, players:[]}, chukkas:4, umpires:'', goalJudges:'', timekeeper:'', notes:''}]}))} style={{ width: '100%', background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted)', padding: '5px', borderRadius: '3px', fontSize: '10px', cursor: 'pointer', letterSpacing: '0.5px', marginBottom: '2px' }}>+ Add match</button>
                                            </div>
                                          ))}
                                          <button onClick={() => setDraft({...draft, days: [...(draft.days||[]), {id:'d'+Date.now(), dateLabel:'', ground:'', matches:[], prizegiving:false}]})} style={{ width: '100%', background: 'transparent', border: '1px dashed var(--line)', color: 'var(--muted)', padding: '7px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>+ Add day</button>
                                          <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => { persistTeamsFromDetails(fixtureDetails); setEditingDetailsId(null); }} style={{ flex: 1, background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Done</button>
                                            {det && <button onClick={async () => { if (!window.confirm(`Delete all match details for “${fx.name}”? They’ll be saved to backups first, so you can restore them from the Fixtures screen.`)) return; await writeBackup(fixtureDetails); const next = { ...fixtureDetails }; delete next[fx.id]; saveFixtureDetails(next); setEditingDetailsId(null); }} style={{ background: 'transparent', color: 'var(--danger)', border: '1px solid var(--danger)', padding: '10px 14px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Clear</button>}
                                          </div>
                                        </div>
                                      );
                                    })()}
                                  </div>
                                );
                              })()}

                              {/* ── Tournament team sign-up ── */}
                              <div style={{ paddingTop: '10px' }}>
                                <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '6px' }}>Teams Entered</div>
                                {teamsHere.length === 0 ? (
                                  <div className="display-italic" style={{ fontSize: '13px', color: 'var(--muted)', padding: '2px 0 6px' }}>
                                    No teams entered yet.
                                  </div>
                                ) : teamsHere.map(s => (
                                  <div key={s.id} className="team-entry">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {s.handicap != null && <div className="mini-badge">{fmtH(s.handicap)}</div>}
                                      <div style={{ fontWeight: 600, fontSize: '15px', flex: 1, minWidth: 0 }}>{s.team}</div>
                                      {captainMode && (
                                        <button className="remove-btn" onClick={() => removeTeam(fx.id, s.id)} aria-label={`Remove ${s.team}`} style={{ fontSize: '18px' }}>×</button>
                                      )}
                                    </div>
                                    {(() => {
                                      if (!s.perDay) {
                                        const squad = s.days[fxDays[0].key] || [];
                                        return (
                                          <div className="squad-line">
                                            {fxDays.length > 1 && <span className="squad-day">Both days</span>}
                                            {squad.length === 0
                                              ? <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Squad TBC</span>
                                              : squad.map((p, i) => <span key={i} className="squad-chip">{p.name}{p.handicap != null && <em>{fmtH(p.handicap)}</em>}</span>)}
                                          </div>
                                        );
                                      }
                                      return fxDays.map(d => (
                                        <div key={d.key} className="squad-line">
                                          <span className="squad-day">{d.label}</span>
                                          {(s.days[d.key] || []).length === 0
                                            ? <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Squad TBC</span>
                                            : (s.days[d.key] || []).map((p, i) => <span key={i} className="squad-chip">{p.name}{p.handicap != null && <em>{fmtH(p.handicap)}</em>}</span>)}
                                        </div>
                                      ));
                                    })()}
                                    {captainMode && s.contact && (
                                      <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px' }}>
                                        Captain: {s.contact}
                                        {s.mobile && <> · <a href={`tel:${s.mobile.replace(/\s+/g, '')}`} className="phone-link" onClick={(e) => e.stopPropagation()}>{s.mobile}</a></>}
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {!isTournamentActive(fx) && (showTeamForm ? (
                                  <div className="register-form" style={{ marginTop: '12px' }}>
                                    <div className="label-eyebrow" style={{ fontSize: '10px', marginBottom: '10px' }}>Enter a team</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      <input
                                        className="input-field"
                                        list="known-team-names"
                                        type="text"
                                        placeholder="Team name"
                                        value={tName}
                                        onChange={(e) => onTeamNameChange(fx, e.target.value)}
                                        style={{ padding: '12px 14px', fontSize: '15px' }}
                                      />
                                      <datalist id="known-team-names">
                                        {Object.values(knownTeams()).map(t => <option key={t.name} value={t.name} />)}
                                      </datalist>
                                      <select
                                        className="input-field select-field"
                                        value={tHandicap}
                                        onChange={(e) => setTHandicap(e.target.value)}
                                        style={{ padding: '12px 14px', fontSize: '15px' }}
                                      >
                                        <option value="">Team handicap (optional)…</option>
                                        {TEAM_HANDICAP_OPTIONS.map(h => <option key={h} value={h}>{fmtH(h)}</option>)}
                                      </select>

                                      {fxDays.length > 1 && (
                                        <div className="perday-toggle">
                                          <button type="button" className={!tPerDay ? 'active' : ''} onClick={() => setTPerDay(false)}>Same team both days</button>
                                          <button type="button" className={tPerDay ? 'active' : ''} onClick={() => setTPerDay(true)}>Different per day</button>
                                        </div>
                                      )}

                                      {(tPerDay && fxDays.length > 1 ? fxDays : [fxDays[0]]).map(d => (
                                        <div key={d.key} className="squad-editor">
                                          <div className="squad-editor-head">
                                            {tPerDay && fxDays.length > 1 ? d.label : (fxDays.length > 1 ? 'Squad — both days' : 'Squad')}
                                          </div>
                                          {(tSquads[d.key] || []).map((row, idx) => (
                                            <div key={idx} className="squad-row">
                                              <input
                                                className="input-field"
                                                type="text"
                                                placeholder={`Player ${idx + 1}`}
                                                value={row.name}
                                                onChange={(e) => setSquadPlayer(d.key, idx, 'name', e.target.value)}
                                                style={{ flex: 1, minWidth: 0, padding: '10px 12px', fontSize: '14px' }}
                                              />
                                              <select
                                                className="input-field select-field"
                                                value={row.handicap}
                                                onChange={(e) => setSquadPlayer(d.key, idx, 'handicap', e.target.value)}
                                                style={{ width: '70px', flexShrink: 0, padding: '10px 4px', fontSize: '14px' }}
                                              >
                                                <option value="">–</option>
                                                {HANDICAP_OPTIONS.map(h => <option key={h} value={h}>{fmtH(h)}</option>)}
                                              </select>
                                              {(tSquads[d.key] || []).length > 1 && (
                                                <button type="button" className="remove-btn" onClick={() => removeSquadPlayer(d.key, idx)} aria-label="Remove player" style={{ fontSize: '18px', flexShrink: 0 }}>×</button>
                                              )}
                                            </div>
                                          ))}
                                          <button type="button" className="add-player-btn" onClick={() => addSquadPlayer(d.key)}>＋ Add player</button>
                                        </div>
                                      ))}

                                      <input
                                        className="input-field"
                                        type="text"
                                        placeholder="Team captain name (optional)"
                                        value={tContact}
                                        onChange={(e) => setTContact(e.target.value)}
                                        style={{ padding: '12px 14px', fontSize: '15px' }}
                                      />
                                      <input
                                        className="input-field"
                                        type="tel"
                                        placeholder="Captain mobile (optional, captain only)"
                                        value={tMobile}
                                        onChange={(e) => setTMobile(e.target.value)}
                                        style={{ padding: '12px 14px', fontSize: '15px' }}
                                      />
                                      <div style={{ fontSize: '11px', color: 'var(--muted)', lineHeight: 1.45, marginTop: '-2px' }}>
                                        Start typing a team name to pull through last season's squad.{fxDays.length > 1 ? ' Choose “Different per day” if your Saturday and Sunday line-ups differ.' : ''}
                                      </div>
                                      {tError && (
                                        <div style={{ fontSize: '12px', color: 'var(--danger)', padding: '8px 12px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)' }}>
                                          {tError}
                                        </div>
                                      )}
                                      <div style={{ display: 'flex', gap: '8px' }}>
                                        <button className="btn-primary" onClick={() => registerTeam(fx)} style={{ flex: 1, padding: '13px', fontSize: '12px' }}>Enter Team</button>
                                        <button onClick={() => setShowTeamForm(false)} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '13px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button className="enter-team-btn" onClick={() => { resetTeamForm(fx); setShowTeamForm(true); }}>
                                    ＋ Enter a team for this fixture
                                  </button>
                                ))}
                              </div>

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

                              {!isTournamentActive(fx) ? (
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
                              ) : (
                                <div style={{ margin: '4px 0 8px', padding: '12px 14px', background: 'var(--cream-warm)', border: '1px solid var(--line)', borderRadius: '4px', textAlign: 'center' }}>
                                  <div className="display-italic" style={{ fontSize: '13px', color: 'var(--muted)' }}>Tournament underway — sign-ups are closed.</div>
                                </div>
                              )}
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

          {activeTab === 'live' && (
            <div style={{ maxWidth: '760px', margin: '0 auto' }}>
              <div style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '0.5px', color: 'var(--burgundy)', textTransform: 'uppercase', marginBottom: '4px' }}>Live Game</div>
              <div style={{ fontSize: '12px', color: '#777', marginBottom: '16px' }}>Live scores update automatically as matches are played.</div>
              {(
                (() => {
                  const liveFixtureIds = Object.keys(fixtureDetails).filter(fid => (fixtureDetails[fid].days || []).some(d => (d.matches || []).length > 0));
                  const fixtureName = (fid) => { const f = fixtures.find(x => x.id === fid); return f ? f.name : fid; };
                  const curFd = liveFixtureId ? fixtureDetails[liveFixtureId] : null;
                  const curDays = curFd ? (curFd.days || []) : [];
                  const curDay = curDays.find(d => d.id === liveDayId) || null;
                  const curMatches = curDay ? (curDay.matches || []) : [];
                  const curMatch = curMatches.find(m => m.id === liveMatchId) || null;
                  return (
                    <div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        <select value={liveDate || ''} onChange={e => { setLiveDate(e.target.value || null); setLiveFixtureId(null); setLiveDayId(null); setLiveMatchId(null); }} style={{ flex: 1, minWidth: '160px', padding: '8px', fontSize: '13px' }}>
                          <option value="">Select date…</option>
                          {Array.from(new Set(Object.keys(fixtureDetails).flatMap(fid => (fixtureDetails[fid] && fixtureDetails[fid].days || []).map(d => d.dateLabel).filter(Boolean)))).map(dl => <option key={dl} value={dl}>{dl}</option>)}
                        </select>
                        <select value={liveFixtureId || ''} disabled={!liveDate} onChange={e => { const fid = e.target.value || null; setLiveFixtureId(fid); const fx = fid ? fixtureDetails[fid] : null; const day = fx ? (fx.days || []).find(d => d.dateLabel === liveDate) : null; setLiveDayId(day ? day.id : null); setLiveMatchId(null); }} style={{ flex: 1, minWidth: '180px', padding: '8px', fontSize: '13px' }}>
                          <option value="">Select tournament…</option>
                          {Object.keys(fixtureDetails).filter(fid => (fixtureDetails[fid] && fixtureDetails[fid].days || []).some(d => d.dateLabel === liveDate)).map(fid => <option key={fid} value={fid}>{fixtureName(fid)}</option>)}
                        </select>
                        <select value={liveMatchId || ''} disabled={!liveFixtureId} onChange={e => setLiveMatchId(e.target.value || null)} style={{ flex: 1, minWidth: '160px', padding: '8px', fontSize: '13px' }}>
                          <option value="">Select match…</option>
                          {curMatches.map(m => <option key={m.id} value={m.id}>{(m.time ? m.time + ' ' : '') + ((m.teamA && m.teamA.name) || 'Team A') + ' v ' + ((m.teamB && m.teamB.name) || 'Team B')}</option>)}
                        </select>
                      </div>
                      {!curMatch ? (
                        <div style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '30px 0' }}>Select a tournament, day and match to begin live scoring.</div>
                      ) : (
                        <div style={{ background: '#fff', border: '1px solid #e5e0d8', borderRadius: '8px', padding: '20px' }}>
                          {curMatch.label && <div style={{ textAlign: 'center', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--burgundy)', marginBottom: '10px' }}>{curMatch.label}</div>}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', color: 'var(--ink)', minHeight: '34px' }}>{(curMatch.teamA && curMatch.teamA.name) || 'TBC'}</div>
                              {liveHeadStart(curMatch, 'A') > 0 && (
                                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px' }}>+{fmtHalf(liveHeadStart(curMatch, 'A'))} on handicap</div>
                              )}
                              <div style={{ fontSize: '46px', fontWeight: 800, color: 'var(--burgundy)', lineHeight: 1.1 }}>{liveDisplayScore(curMatch, 'A')}</div>
                              {captainMode && (
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                                <button onClick={() => bumpTeamScore(liveFixtureId, liveDayId, liveMatchId, 'teamA', -1)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ccc', background: '#f7f4ef', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#555' }}>&minus;</button>
                                <button onClick={() => bumpTeamScore(liveFixtureId, liveDayId, liveMatchId, 'teamA', 1)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'var(--burgundy)', color: '#fff', fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                              </div>
                              )}
                            </div>
                            <div style={{ alignSelf: 'center', fontSize: '16px', color: '#bbb', fontWeight: 700 }}>vs</div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                              <div style={{ fontWeight: 700, fontSize: '14px', textTransform: 'uppercase', color: 'var(--ink)', minHeight: '34px' }}>{(curMatch.teamB && curMatch.teamB.name) || 'TBC'}</div>
                              {liveHeadStart(curMatch, 'B') > 0 && (
                                <div style={{ fontSize: '10px', color: 'var(--muted)', letterSpacing: '0.5px' }}>+{fmtHalf(liveHeadStart(curMatch, 'B'))} on handicap</div>
                              )}
                              <div style={{ fontSize: '46px', fontWeight: 800, color: 'var(--burgundy)', lineHeight: 1.1 }}>{liveDisplayScore(curMatch, 'B')}</div>
                              {captainMode && (
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '6px' }}>
                                <button onClick={() => bumpTeamScore(liveFixtureId, liveDayId, liveMatchId, 'teamB', -1)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #ccc', background: '#f7f4ef', fontSize: '20px', fontWeight: 700, cursor: 'pointer', color: '#555' }}>&minus;</button>
                                <button onClick={() => bumpTeamScore(liveFixtureId, liveDayId, liveMatchId, 'teamB', 1)} style={{ width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'var(--burgundy)', color: '#fff', fontSize: '20px', fontWeight: 700, cursor: 'pointer' }}>+</button>
                              </div>
                              )}
                            </div>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#999', margin: '18px 0 8px', textAlign: 'center' }}>Player Goals</div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: 1, minWidth: '220px' }}>
                              <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--burgundy)', marginBottom: '6px' }}>{(curMatch.teamA && curMatch.teamA.name) || 'Team'}</div>
                              {((curMatch.teamA && curMatch.teamA.players) || []).map((p, pi) => (
                                (captainMode || (Number(p.goals)||0) > 0) ? (
                                <div key={pi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '5px 0', borderBottom: '1px solid #f0ece4' }}>
                                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{p.name || 'Player ' + (pi + 1)}{(Number(p.goals)||0) > 0 && <span style={{ marginLeft: '8px', color: 'var(--burgundy)', fontWeight: 700 }}>{Number(p.goals)}</span>}</span>
                                  {captainMode && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button onClick={() => bumpPlayerGoals(liveFixtureId, liveDayId, liveMatchId, 'teamA', pi, -1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #ccc', background: '#f7f4ef', fontSize: '14px', cursor: 'pointer', color: '#555' }}>&minus;</button>
                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: 'var(--burgundy)' }}>{p.goals == null ? 0 : p.goals}</span>
                                    <button onClick={() => bumpPlayerGoals(liveFixtureId, liveDayId, liveMatchId, 'teamA', pi, 1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'var(--burgundy)', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>+</button>
                                  </div>
                                  )}
                                </div>
                                ) : null
                              ))}
                              {(!(curMatch.teamA && curMatch.teamA.players) || curMatch.teamA.players.length === 0) && <div style={{ fontSize: '12px', color: '#aaa' }}>No players listed.</div>}
                            </div>
                            <div style={{ flex: 1, minWidth: '220px' }}>
                              <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--burgundy)', marginBottom: '6px' }}>{(curMatch.teamB && curMatch.teamB.name) || 'Team'}</div>
                              {((curMatch.teamB && curMatch.teamB.players) || []).map((p, pi) => (
                                (captainMode || (Number(p.goals)||0) > 0) ? (
                                <div key={pi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '5px 0', borderBottom: '1px solid #f0ece4' }}>
                                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>{p.name || 'Player ' + (pi + 1)}{(Number(p.goals)||0) > 0 && <span style={{ marginLeft: '8px', color: 'var(--burgundy)', fontWeight: 700 }}>{Number(p.goals)}</span>}</span>
                                  {captainMode && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <button onClick={() => bumpPlayerGoals(liveFixtureId, liveDayId, liveMatchId, 'teamB', pi, -1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #ccc', background: '#f7f4ef', fontSize: '14px', cursor: 'pointer', color: '#555' }}>&minus;</button>
                                    <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 700, fontSize: '14px', color: 'var(--burgundy)' }}>{p.goals == null ? 0 : p.goals}</span>
                                    <button onClick={() => bumpPlayerGoals(liveFixtureId, liveDayId, liveMatchId, 'teamB', pi, 1)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: 'none', background: 'var(--burgundy)', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>+</button>
                                  </div>
                                  )}
                                </div>
                                ) : null
                              ))}
                              {(!(curMatch.teamB && curMatch.teamB.players) || curMatch.teamB.players.length === 0) && <div style={{ fontSize: '12px', color: '#aaa' }}>No players listed.</div>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
              {!captainMode && (
                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid var(--line)', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#777', marginBottom: '10px' }}>Scores are visible to everyone. Only captains can update them.</div>
                  <button onClick={() => setPinModalOpen(true)} style={{ background: 'none', border: '1px solid var(--burgundy)', color: 'var(--burgundy)', borderRadius: '6px', padding: '9px 18px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', letterSpacing: '0.5px' }}>Enter Captain PIN to enter scores</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'players' && captainMode && (
            <div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
                <button onClick={() => setPlayersView('players')} style={{ flex: 1, padding: '9px 4px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase', cursor: 'pointer', border: playersView === 'players' ? 'none' : '1px solid var(--line)', background: playersView === 'players' ? 'var(--burgundy)' : 'transparent', color: playersView === 'players' ? 'var(--cream)' : 'var(--muted)' }}>Players</button>
                <button onClick={() => setPlayersView('subsidies')} style={{ flex: 1, padding: '9px 4px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase', cursor: 'pointer', border: playersView === 'subsidies' ? 'none' : '1px solid var(--line)', background: playersView === 'subsidies' ? 'var(--burgundy)' : (lowSubsidies.length > 0 ? '#fbf2f2' : 'transparent'), color: playersView === 'subsidies' ? 'var(--cream)' : (lowSubsidies.length > 0 ? 'var(--danger)' : 'var(--muted)') }}>Subsidies{lowSubsidies.length > 0 ? ` (${lowSubsidies.length})` : ''}</button>
                <button onClick={() => setPlayersView('checkout')} style={{ flex: 1, padding: '9px 4px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.3px', textTransform: 'uppercase', cursor: 'pointer', border: playersView === 'checkout' ? 'none' : '1px solid var(--line)', background: playersView === 'checkout' ? 'var(--burgundy)' : 'transparent', color: playersView === 'checkout' ? 'var(--cream)' : 'var(--muted)' }}>Checkout</button>
              </div>

              {playersView === 'players' && (<>
              <div style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '0.5px', color: 'var(--burgundy)', textTransform: 'uppercase', marginBottom: '4px' }}>Player Database</div>
              <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px' }}>
                {playerDb.length} player{playerDb.length === 1 ? '' : 's'} &middot; captain only &middot; synced across devices
              </div>

              {pdbError && (
                <div style={{ fontSize: '12px', color: 'var(--burgundy)', padding: '8px 12px', background: 'var(--cream-pale)', borderRadius: '4px', borderLeft: '3px solid var(--gold)', marginBottom: '12px' }}>{pdbError}</div>
              )}

              {!playerEditor && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                  <input className="input-field" type="text" placeholder="Search players…" value={playerSearch} onChange={e => setPlayerSearch(e.target.value)} style={{ flex: 1, minWidth: '140px', padding: '10px 12px', fontSize: '14px' }} />
                  <button onClick={openNewPlayer} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer' }}>+ Add</button>
                  <button onClick={importEveryone} style={{ background: 'transparent', color: 'var(--muted)', border: '1px solid var(--line)', padding: '10px 14px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Import all</button>
                </div>
              )}

              {playerEditor && (
                <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '14px', marginBottom: '16px', background: 'var(--cream-pale)' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--burgundy)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{playerEditor.id ? 'Edit player' : 'New player'}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input className="input-field" type="text" placeholder="Full name" value={playerEditor.name} onChange={e => setPlayerEditor({ ...playerEditor, name: e.target.value })} style={{ padding: '11px 13px', fontSize: '15px' }} />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <select className="input-field select-field" value={playerEditor.handicap} onChange={e => setPlayerEditor({ ...playerEditor, handicap: e.target.value })} style={{ width: '120px', flexShrink: 0, padding: '11px 8px', fontSize: '14px' }}>
                        <option value="">Handicap…</option>
                        {HANDICAP_OPTIONS.map(h => <option key={h} value={h}>{h > 0 ? `+${h}` : h}</option>)}
                      </select>
                      <select className="input-field select-field" value={playerEditor.membership || 'none'} onChange={e => setPlayerEditor({ ...playerEditor, membership: e.target.value })} style={{ flex: 1, padding: '11px 8px', fontSize: '14px' }}>
                        {MEMBERSHIP_TYPES_2026.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                      </select>
                    </div>
                    <div style={{ fontSize: '11px', color: membershipById(playerEditor.membership || 'none').chukkasIncluded ? 'var(--burgundy)' : 'var(--muted)', marginTop: '-4px', lineHeight: 1.45 }}>
                      {membershipById(playerEditor.membership || 'none').chukkasIncluded
                        ? '✓ Chukka fees included — booking adds them straight to the roster.'
                        : 'Pays per chukka — booking sends them to checkout to pay first.'}
                    </div>
                    <input className="input-field" type="email" placeholder="Email" value={playerEditor.email} onChange={e => setPlayerEditor({ ...playerEditor, email: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px' }} />
                    <input className="input-field" type="tel" placeholder="Mobile" value={playerEditor.mobile} onChange={e => setPlayerEditor({ ...playerEditor, mobile: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px' }} />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={!!playerEditor.military} onChange={e => setPlayerEditor({ ...playerEditor, military: e.target.checked })} />
                      Military (eligible for subsidies)
                    </label>
                    {playerEditor.military && (
                      <input className="input-field" type="text" placeholder="Regiment / unit (optional)" value={playerEditor.unit} onChange={e => setPlayerEditor({ ...playerEditor, unit: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px' }} />
                    )}
                    {playerEditor.military && (
                      <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 12px', background: '#fff' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Subsidies</div>
                        {activeSubsidies.length === 0 ? (
                          <div style={{ fontSize: '12px', color: 'var(--muted)' }}>No subsidies defined yet — add them under the Subsidies tab.</div>
                        ) : (
                          activeSubsidies.map(s => (
                            <label key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer', padding: '3px 0' }}>
                              <input type="checkbox" checked={(playerEditor.subsidies || []).includes(s.id)} onChange={e => {
                                const cur = new Set(playerEditor.subsidies || []);
                                if (e.target.checked) cur.add(s.id); else cur.delete(s.id);
                                setPlayerEditor({ ...playerEditor, subsidies: [...cur] });
                              }} />
                              {s.name} <span style={{ color: 'var(--muted)' }}>(−£{fmtMoney(s.discountPerChukka)}/chukka)</span>
                            </label>
                          ))
                        )}
                        {(() => {
                          const base = PONY_HIRE_2026.club;
                          const subs = (playerEditor.subsidies || []).reduce((sum, sid) => { const s = subsidies.find(x => x.id === sid && x.active !== false); return sum + (s ? (Number(s.discountPerChukka) || 0) : 0); }, 0);
                          const net = Math.max(0, base - MILITARY_DISCOUNT_PER_CHUKKA - subs);
                          return (
                            <div style={{ fontSize: '12px', color: 'var(--burgundy)', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--line)' }}>
                              Est. club chukka: <strong>£{fmtMoney(net)}</strong>
                              <span style={{ color: 'var(--muted)' }}> (£{base} base − £{MILITARY_DISCOUNT_PER_CHUKKA} mil{subs > 0 ? ` − £${fmtMoney(subs)} subsidies` : ''})</span>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer' }}>
                      <input type="checkbox" checked={playerEditor.active !== false} onChange={e => setPlayerEditor({ ...playerEditor, active: e.target.checked })} />
                      Active member
                    </label>
                    <textarea className="input-field" placeholder="Notes (optional)" value={playerEditor.notes} onChange={e => setPlayerEditor({ ...playerEditor, notes: e.target.value })} rows={2} style={{ padding: '11px 13px', fontSize: '13px', resize: 'vertical' }} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                      <button onClick={savePlayer} style={{ flex: 1, background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Save</button>
                      <button onClick={() => { setPlayerEditor(null); setPdbError(''); }} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                      {playerEditor.id && (
                        <button onClick={() => deletePlayer(playerEditor.id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {!playerEditor && (
                visiblePlayers.length === 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '28px 12px', lineHeight: 1.5 }}>
                    {playerDb.length === 0 ? 'No players yet. Add one, or import from the members directory.' : 'No players match your search.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {visiblePlayers.map(p => (
                      <div key={p.id} onClick={() => openEditPlayer(p)} style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '12px 14px', background: '#fff', cursor: 'pointer', opacity: p.active === false ? 0.55 : 1 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                          <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>{p.name}</span>
                          {p.handicap != null && <span style={{ fontSize: '13px', color: 'var(--muted)' }}>({p.handicap > 0 ? `+${p.handicap}` : p.handicap})</span>}
                          <span style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                            {!membershipById(p.membership || 'none').chukkasIncluded && <span title="Pays per chukka — no chukka-inclusive membership" style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--muted)', border: '1px solid var(--line)', padding: '2px 6px', borderRadius: '3px' }}>£/chukka</span>}
                            {p.military && <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--cream)', background: 'var(--gold)', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>Mil</span>}
                            {p.active === false && <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--muted)', border: '1px solid var(--line)', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>Inactive</span>}
                          </span>
                        </div>
                        {(p.email || p.mobile || p.unit) && (
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>
                            {[p.unit, p.mobile, p.email].filter(Boolean).join('  ·  ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
              </>)}

              {playersView === 'subsidies' && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '0.5px', color: 'var(--burgundy)', textTransform: 'uppercase', marginBottom: '4px' }}>Subsidies</div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                    Pots the captain tops up through the year. Each gives a fixed £/chukka discount to the military players assigned to it; spending at checkout draws the pot down.
                  </div>

                  {subError && (
                    <div style={{ fontSize: '12px', color: 'var(--burgundy)', padding: '8px 12px', background: 'var(--cream-pale)', borderRadius: '4px', borderLeft: '3px solid var(--gold)', marginBottom: '12px' }}>{subError}</div>
                  )}

                  {lowSubsidies.length > 0 && !subsidyEditor && (
                    <div style={{ fontSize: '12px', color: 'var(--danger)', padding: '10px 12px', background: '#fbf2f2', borderRadius: '4px', borderLeft: '3px solid var(--danger)', marginBottom: '12px', lineHeight: 1.5 }}>
                      <strong>Running low:</strong> {lowSubsidies.map(s => s.name).join(', ')}. Time to apply for more funds.
                    </div>
                  )}

                  {!subsidyEditor && (
                    <button onClick={openNewSubsidy} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '10px 16px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '14px' }}>+ Add subsidy</button>
                  )}

                  {subsidyEditor && (
                    <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '14px', marginBottom: '16px', background: 'var(--cream-pale)' }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--burgundy)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subsidyEditor.id ? 'Edit subsidy' : 'New subsidy'}</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input className="input-field" type="text" placeholder="Subsidy name e.g. RA Charitable Fund" value={subsidyEditor.name} onChange={e => setSubsidyEditor({ ...subsidyEditor, name: e.target.value })} style={{ padding: '11px 13px', fontSize: '15px' }} />
                        {!subsidyEditor.id && (
                          <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Opening balance (£)
                            <input className="input-field" type="number" inputMode="decimal" min="0" step="0.01" placeholder="1000" value={subsidyEditor.balance} onChange={e => setSubsidyEditor({ ...subsidyEditor, balance: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px', marginTop: '4px' }} />
                          </label>
                        )}
                        <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Discount per chukka (£)
                          <input className="input-field" type="number" inputMode="decimal" min="0" step="0.01" placeholder="10" value={subsidyEditor.discountPerChukka} onChange={e => setSubsidyEditor({ ...subsidyEditor, discountPerChukka: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px', marginTop: '4px' }} />
                        </label>
                        <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Warn when balance falls to (£)
                          <input className="input-field" type="number" inputMode="decimal" min="0" step="0.01" placeholder="100" value={subsidyEditor.lowThreshold} onChange={e => setSubsidyEditor({ ...subsidyEditor, lowThreshold: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px', marginTop: '4px' }} />
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--ink)', cursor: 'pointer' }}>
                          <input type="checkbox" checked={subsidyEditor.active !== false} onChange={e => setSubsidyEditor({ ...subsidyEditor, active: e.target.checked })} />
                          Active
                        </label>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '2px' }}>
                          <button onClick={saveSubsidy} style={{ flex: 1, background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '12px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>Save</button>
                          <button onClick={() => { setSubsidyEditor(null); setSubError(''); }} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '12px 16px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                          {subsidyEditor.id && (
                            <button onClick={() => deleteSubsidy(subsidyEditor.id)} style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '12px 14px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {!subsidyEditor && (
                    subsidies.length === 0 ? (
                      <div style={{ fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '28px 12px', lineHeight: 1.5 }}>No subsidies yet. Add one to start managing a pot.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {subsidies.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(s => {
                          const bal = Number(s.balance) || 0;
                          const low = bal <= (Number(s.lowThreshold) || 0);
                          const assigned = playerDb.filter(p => Array.isArray(p.subsidies) && p.subsidies.includes(s.id)).length;
                          return (
                            <div key={s.id} style={{ border: `1px solid ${low ? 'var(--danger)' : 'var(--line)'}`, borderRadius: '6px', padding: '12px 14px', background: '#fff', opacity: s.active === false ? 0.55 : 1 }}>
                              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                <span style={{ fontWeight: 600, fontSize: '15px', color: 'var(--ink)' }}>{s.name}</span>
                                {s.active === false && <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px', color: 'var(--muted)', border: '1px solid var(--line)', padding: '2px 6px', borderRadius: '3px', textTransform: 'uppercase' }}>Off</span>}
                                <span style={{ marginLeft: 'auto', fontWeight: 700, fontSize: '15px', color: low ? 'var(--danger)' : 'var(--burgundy)' }}>£{fmtMoney(bal)}</span>
                              </div>
                              <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '3px' }}>
                                −£{fmtMoney(s.discountPerChukka)}/chukka &middot; {assigned} player{assigned === 1 ? '' : 's'} &middot; warn ≤ £{fmtMoney(s.lowThreshold)}
                              </div>
                              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                <button onClick={() => topUpSubsidy(s.id)} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Top up</button>
                                <button onClick={() => openEditSubsidy(s)} style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '8px 14px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Edit</button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )}
                </div>
              )}

              {playersView === 'checkout' && (() => {
                const pl = playerDb.find(p => p.id === checkout.playerId) || null;
                const bd = pl ? priceBooking(pl, checkout.chukkas, checkout.ponyLevel) : null;
                const n = bd ? bd.chukkas : 0;
                const dayLabels = { wed: 'Wed', thu: 'Thu', sat: 'Sat', sun: 'Sun' };
                const ponyOpts = [['none', 'No pony hire (own pony)'], ['club', 'Club chukka'], ['-6 to -2', '−6 to −2 match'], ['-2 to 0', '−2 to 0 match'], ['0 to 2', '0 to 2 match'], ['2 to 4', '2 to 4 match']];
                const methods = [['cash', 'Cash'], ['transfer', 'Bank transfer'], ['card', 'Card (manual)'], ['other', 'Other']];
                return (
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '0.5px', color: 'var(--burgundy)', textTransform: 'uppercase', marginBottom: '4px' }}>Checkout</div>
                    <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                      Record a payment (cash, transfer or card) and add the player to a day's roster. Subsidy pots draw down automatically. Online card via Stripe wires in here later.
                    </div>

                    {coError && (
                      <div style={{ fontSize: '12px', color: 'var(--burgundy)', padding: '8px 12px', background: 'var(--cream-pale)', borderRadius: '4px', borderLeft: '3px solid var(--gold)', marginBottom: '12px', lineHeight: 1.5 }}>{coError}</div>
                    )}

                    {(() => {
                      const due = transactions.filter(t => t.status === 'due');
                      if (due.length === 0) return null;
                      const dayNames = { wed: 'Wednesday', thu: 'Thursday', sat: 'Saturday', sun: 'Sunday' };
                      const methodOpts = [['cash', 'Cash'], ['transfer', 'Transfer'], ['card', 'Card'], ['other', 'Other']];
                      return (
                        <div style={{ marginBottom: '22px' }}>
                          <div style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--danger)', marginBottom: '4px' }}>To invoice ({due.length})</div>
                          <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '12px', lineHeight: 1.5 }}>Players on a roster who owe for chukkas. Mark paid once settled (this draws down any subsidy pots), or remove them from the roster on the day tab if they don't pay then Void the charge here.</div>
                          {DAY_KEYS.filter(dk => due.some(t => t.day === dk)).map(dk => (
                            <div key={dk} style={{ marginBottom: '12px' }}>
                              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>{dayNames[dk] || dk}</div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {due.filter(t => t.day === dk).map(t => (
                                  <div key={t.id} style={{ border: '1px solid var(--danger)', borderRadius: '6px', padding: '10px 12px', background: '#fff' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                                      <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>{t.playerName}</span>
                                      <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--danger)' }}>£{fmtMoney(t.total)}</span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                                      {t.chukkas} chukka{t.chukkas === 1 ? '' : 's'}{t.ponyLevel === 'none' ? ' · own pony' : ' · pony hire'}{t.subsidyDeductions && t.subsidyDeductions.length ? ` · ${t.subsidyDeductions.map(d => `${d.name} −£${fmtMoney(d.amount)}`).join(', ')}` : ''}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center' }}>
                                      <select value={dueMethod[t.id] || 'cash'} onChange={e => setDueMethod({ ...dueMethod, [t.id]: e.target.value })} className="input-field select-field" style={{ flex: 1, padding: '8px', fontSize: '12px' }}>
                                        {methodOpts.map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                                      </select>
                                      <button onClick={() => markDuePaid(t.id, dueMethod[t.id] || 'cash')} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '8px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', cursor: 'pointer' }}>Mark paid</button>
                                      <button onClick={() => voidDue(t.id)} title="Remove this charge" style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--muted)', padding: '8px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Void</button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}

                    <div style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>Take a payment manually</div>
                    <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Player
                      <select className="input-field select-field" value={checkout.playerId} onChange={e => {
                        setCoError('');
                        const pid = e.target.value;
                        const player = playerDb.find(p => p.id === pid);
                        let lvl = checkout.ponyLevel;
                        if (player) {
                          for (const dk of DAY_KEYS) {
                            const entry = (rosters[dk] || []).find(r => (r.name || '').trim().toLowerCase() === (player.name || '').trim().toLowerCase());
                            if (entry) { lvl = entry.ponyHire === false ? 'none' : 'club'; break; }
                          }
                        }
                        setCheckout({ ...checkout, playerId: pid, ponyLevel: lvl });
                      }} style={{ padding: '11px 8px', fontSize: '14px', marginTop: '4px' }}>
                        <option value="">Select a registered player…</option>
                        {playerDb.slice().sort((a, b) => (a.name || '').localeCompare(b.name || '')).map(p => (
                          <option key={p.id} value={p.id}>{p.name}{membershipById(p.membership || 'none').chukkasIncluded ? ' · member' : ''}</option>
                        ))}
                      </select>
                    </label>

                    {pl && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', color: bd.freeToRoster ? 'var(--burgundy)' : 'var(--muted)' }}>
                          {membershipById(pl.membership || 'none').label}{pl.military ? ' · military' : ''}
                          {bd.freeToRoster ? ' — no charge' : ` — £${fmtMoney(bd.total)}`}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <select className="input-field select-field" value={checkout.day} onChange={e => setCheckout({ ...checkout, day: e.target.value })} style={{ flex: 1, padding: '11px 8px', fontSize: '14px' }}>
                            {DAY_KEYS.map(d => <option key={d} value={d}>{dayLabels[d] || d}</option>)}
                          </select>
                          <select className="input-field select-field" value={checkout.chukkas} onChange={e => setCheckout({ ...checkout, chukkas: e.target.value })} style={{ width: '110px', flexShrink: 0, padding: '11px 8px', fontSize: '14px' }}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(c => <option key={c} value={String(c)}>{c} chukka{c === 1 ? '' : 's'}</option>)}
                          </select>
                        </div>

                        <select className="input-field select-field" value={checkout.ponyLevel} onChange={e => setCheckout({ ...checkout, ponyLevel: e.target.value })} style={{ padding: '11px 8px', fontSize: '14px' }}>
                          {ponyOpts.map(([k, l]) => <option key={k} value={k}>{k === 'none' ? l : `Pony hire: ${l} (£${PONY_HIRE_2026[k]})`}</option>)}
                        </select>

                        {bd.freeToRoster ? (
                          <div style={{ fontSize: '13px', color: 'var(--burgundy)', padding: '12px', background: 'var(--cream-pale)', borderRadius: '6px', border: '1px solid var(--line)' }}>
                            No charge for this booking — they'll be added straight to the roster.
                          </div>
                        ) : (
                          <>
                            <div style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '12px 14px', background: 'var(--cream-pale)', fontSize: '13px', color: 'var(--ink)' }}>
                              {bd.ponyHire > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>Pony hire × {n}</span><span>£{fmtMoney(bd.ponyHire * n)}</span></div>}
                              {bd.chukkaFee > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}><span>Chukka fee × {n}</span><span>£{fmtMoney(bd.chukkaFee * n)}</span></div>}
                              {bd.militaryDiscount > 0 && <div style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: 'var(--muted)' }}><span>Military discount × {n}</span><span>−£{fmtMoney(bd.militaryDiscount)}</span></div>}
                              {bd.subsidyDeductions.map(d => (
                                <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '2px 0', color: d.capped ? 'var(--danger)' : 'var(--muted)' }}>
                                  <span>{d.name}{d.capped ? ' (pot capped)' : ''}</span><span>−£{fmtMoney(d.amount)}</span>
                                </div>
                              ))}
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0 0', marginTop: '6px', borderTop: '1px solid var(--line)', fontWeight: 700, fontSize: '15px', color: 'var(--burgundy)' }}><span>Total</span><span>£{fmtMoney(bd.total)}</span></div>
                            </div>
                            <select className="input-field select-field" value={checkout.method} onChange={e => setCheckout({ ...checkout, method: e.target.value })} style={{ padding: '11px 8px', fontSize: '14px' }}>
                              {methods.map(([k, l]) => <option key={k} value={k}>Paid by: {l}</option>)}
                            </select>
                            <input className="input-field" type="text" placeholder="Note (optional)" value={checkout.note} onChange={e => setCheckout({ ...checkout, note: e.target.value })} style={{ padding: '11px 13px', fontSize: '14px' }} />
                          </>
                        )}

                        <button onClick={doMarkPaid} style={{ background: 'var(--burgundy)', color: 'var(--cream)', border: 'none', padding: '13px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
                          {bd.freeToRoster ? `Add to ${dayLabels[checkout.day] || checkout.day} roster` : `Mark paid £${fmtMoney(bd.total)} & add to roster`}
                        </button>
                      </div>
                    )}

                    <div style={{ fontWeight: 600, fontSize: '12px', letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--muted)', margin: '22px 0 8px' }}>Recent payments</div>
                    {transactions.filter(t => t.status !== 'due').length === 0 ? (
                      <div style={{ fontSize: '12px', color: 'var(--muted)', textAlign: 'center', padding: '16px 12px' }}>No payments recorded yet.</div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {transactions.filter(t => t.status !== 'due').slice(0, 25).map(tx => (
                          <div key={tx.id} style={{ border: '1px solid var(--line)', borderRadius: '6px', padding: '10px 12px', background: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--ink)' }}>{tx.playerName}</span>
                              <span style={{ fontWeight: 700, fontSize: '14px', color: 'var(--burgundy)' }}>£{fmtMoney(tx.total)}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px' }}>
                              {new Date(tx.date).toLocaleDateString('en-GB')} &middot; {tx.chukkas} chukka{tx.chukkas === 1 ? '' : 's'} &middot; {tx.method}
                              {tx.subsidyDeductions && tx.subsidyDeductions.length ? ` · ${tx.subsidyDeductions.map(d => `${d.name} −£${fmtMoney(d.amount)}`).join(', ')}` : ''}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}
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
