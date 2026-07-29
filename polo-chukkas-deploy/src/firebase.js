import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ",
    authDomain: "tedworth-park-polo.firebaseapp.com",
    projectId: "tedworth-park-polo",
    storageBucket: "tedworth-park-polo.firebasestorage.app",
    messagingSenderId: "856516284253",
    appId: "1:856516284253:web:68b21c3b23dd8d504062b4"
};

export const app = initializeApp(firebaseConfig);

// ── Anonymous auth ────────────────────────────────────────────────────────
// The app has no login, but signing each visitor in anonymously lets Firestore
// security rules require an auth token to WRITE (reads can stay public for the
// scoreboard + Watch app) — closing the "public database" hole without a
// user-facing login. `authReady` resolves once sign-in completes; storage.js
// awaits it before writing. This is safe even if the Anonymous provider is not
// enabled (sign-in just fails and writes fall back to whatever the rules allow).
// To get the benefit, enable Anonymous auth in the Firebase console and set
// rules: allow read: if true; allow write: if request.auth != null;
export const auth = getAuth(app);
export const authReady = signInAnonymously(auth)
  .then(() => true)
  .catch((e) => {
    console.warn('Anonymous sign-in failed — enable the Anonymous provider in '
      + 'Firebase to lock writes.', e && (e.code || e.message));
    return false;
  });

// Plain Firestore (no on-device persistent cache). The persistent IndexedDB
// cache was reverted: on a cold start it could briefly serve a STALE snapshot,
// and the app performs destructive actions on load (the weekly roster auto-clear
// deletes a day's roster based on the value it reads). A stale read there could
// delete a current roster on the server, losing sign-ups. Reading straight from
// the server on cold start avoids that whole class of bug. storage.js imports
// this single `db` instance.
export const db = getFirestore(app);
