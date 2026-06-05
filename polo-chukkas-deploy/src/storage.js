// Replaces the artifact's window.storage with a Firestore-backed implementation.
// Keeps the exact same API (get/set/delete/list) so PoloChukkas.jsx works unchanged.
// Adds live cross-device sync: when one club member adds a player, every other
// device with the page open sees the update within milliseconds.

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { firebaseConfig } from './firebase';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const collectionName = (shared) => (shared ? 'shared' : 'private');

// In-memory cache that the live listeners keep up to date.
// When PoloChukkas.jsx calls get(), we return the cached value (synced from Firestore).
// When it calls set(), we write to Firestore — and the listener pushes the change
// out to all other devices in real time.
const cache = new Map(); // `${collection}/${key}` → value

const storage = {
  async get(key, shared = false) {
    const cacheKey = `${collectionName(shared)}/${key}`;
    if (cache.has(cacheKey)) {
      return { key, value: cache.get(cacheKey), shared };
    }
    const snap = await getDoc(doc(db, collectionName(shared), key));
    if (snap.exists()) {
      const value = snap.data().value;
      cache.set(cacheKey, value);
      return { key, value, shared };
    }
    return null;
  },

  async set(key, value, shared = false) {
    const cacheKey = `${collectionName(shared)}/${key}`;
    cache.set(cacheKey, value);
    await setDoc(doc(db, collectionName(shared), key), { value });
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    const cacheKey = `${collectionName(shared)}/${key}`;
    cache.delete(cacheKey);
    await deleteDoc(doc(db, collectionName(shared), key));
    return { key, deleted: true, shared };
  },

  async list(prefix = '', shared = false) {
    const snap = await getDocs(collection(db, collectionName(shared)));
    const keys = [];
    snap.forEach((d) => {
      if (!prefix || d.id.startsWith(prefix)) keys.push(d.id);
    });
    return { keys, prefix, shared };
  },
};

// ── Live sync: subscribe to every shared key the app uses ────────────
// When Firestore changes (from this device OR any other), update the cache
// AND dispatch a window-level event so React components can re-read.
// IMPORTANT: every persistent *shared* key must appear here or it silently won't
// sync across devices. Per-day keys follow PoloChukkas.jsx's storageKey scheme:
// `base` for Wednesday, `base-<day>` for thu/sat/sun.
const DAYS = ['wed', 'thu', 'sat', 'sun'];
const perDay = (base) => DAYS.map((d) => (d === 'wed' ? base : `${base}-${d}`));

const SYNC_KEYS = [
  ...perDay('roster'),       // rosters for every day (was: Wednesday only)
  ...perDay('roster-week'),  // roster week-stamps (drive auto-clear)
  ...perDay('schedule'),     // drawn chukka schedules
  ...perDay('throwin'),      // per-day throw-in times
  'fixture-interest',
  'wa-link',
  'members',
  'team-signups',
  'fixtures',
  'players',                 // captain-managed player database
  'fixture-details',         // match details / teams shown on the fixtures tab
  'teams-db',
  'fixture-details-backups',
];

SYNC_KEYS.forEach((key) => {
  const cacheKey = `shared/${key}`;
  onSnapshot(doc(db, 'shared', key), (snap) => {
    if (snap.exists()) {
      cache.set(cacheKey, snap.data().value);
    } else {
      cache.delete(cacheKey);
    }
    // Tell the app a remote change happened so it can re-render
    window.dispatchEvent(new CustomEvent('storage-changed', { detail: { key } }));
  });
});

// Make the storage object globally available — PoloChukkas.jsx already uses
// `window.storage.get(...)` so this preserves the existing API exactly.
if (typeof window !== 'undefined') {
  window.storage = storage;
}

export default storage;
