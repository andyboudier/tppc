// What this club is, for the emails the app sends (_bookingEmail.js and
// _reminders.js). Those two files name no club and are the same in every app;
// this one is the club's own.
//
//   CLUB      name, short name and place, from the same block the app's own
//             screens read (TERMS_CLUB in src/terms.js), and its dark colours
//   CREST     the badge for the top of an email — a PNG, because mail clients
//             do not draw SVG — and whether to set it in a white round
//   PROJECT   the Firebase project to read when a build sets no VITE_FIREBASE_*
//   APP_URL   where the app lives, when APP_URL is not set on the project
//   DAYS      the chukka days — mirrors DAY_CONFIG in the main component:
//             weekday, names and default throw-ins. Keep the two in step.
//   storageKey  how a day's keys are suffixed: TPPC and Vaux keep the first
//             day under the bare key; Druids suffixes every day
//   SESSION_NAMES  the club sessions sold from Lessons, by `kind`; none at
//             Druids and Vaux
//   MAIL      the sender (and a verified fallback) and the reply-to address
//   NOTIFY    the office addresses told of every booking event

import { TERMS_CLUB } from '../src/terms.js';

export const CLUB = TERMS_CLUB;
export const CREST = { src: '/tppc-crest.png', round: true };
export const PROJECT = { projectId: 'tedworth-park-polo', apiKey: '' };
export const APP_URL = 'https://tppc.poloact.co.uk';

export const DAYS = {
  wed: { dow: 3, day: 'Wednesday', name: 'Wednesday Chukkas', start: '17:30' },
  thu: { dow: 4, day: 'Thursday', name: 'Ladies Only', start: '10:00' },
  fri: { dow: 5, day: 'Friday', name: 'Instructional Chukkas', start: '17:30' },
  sat: { dow: 6, day: 'Saturday', name: 'Saturday Chukkas', start: '11:00' },
  sun: { dow: 0, day: 'Sunday', name: 'Sunday Chukkas', start: '11:00' },
};
export const storageKey = (base, dk) => (dk === 'wed' ? base : `${base}-${dk}`);

export const SESSION_NAMES = { ladies: 'Ladies Only', instructional: 'Instructional Chukkas' };

// Who the club's mail comes from, and the fallback while that domain is not
// yet verified in Resend: the poloact address, with replies going to the
// club. Once tedworthparkpolo.com is verified the first is used as it is.
export const MAIL = {
  from: 'Tedworth Park Polo Club <info@tedworthparkpolo.com>',
  fallbackFrom: 'Tedworth Park Polo Club <hello@poloact.co.uk>',
  replyTo: 'info@tedworthparkpolo.com',
};
// Told of every booking, change, cancellation, waiting-list move and
// tournament entry. NOTIFY_EMAILS on the Vercel project replaces the list.
export const NOTIFY = ['info@tedworthparkpolo.com', 'helen@tedworthparkpolo.com', 'bradley@tedworthparkpolo.com'];
