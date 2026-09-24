import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { IS_DEV } from './appEnv';

// The club's live project. Used whenever the build does not name another.
const LIVE = {
    apiKey: "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ",
    authDomain: "tedworth-park-polo.firebaseapp.com",
    projectId: "tedworth-park-polo",
    storageBucket: "tedworth-park-polo.firebasestorage.app",
    messagingSenderId: "856516284253",
    appId: "1:856516284253:web:68b21c3b23dd8d504062b4"
};

// A build may name a different project through VITE_FIREBASE_* — that is how
// TPPC-Dev gets its own database while sharing every line of this file. These
// are the public web config, not secrets; they live in Vercel's env only so
// the one file can serve both. No variables set means the live project, which
// is exactly what the club's own build has always done.
const env = import.meta.env;
const FROM_ENV = env.VITE_FIREBASE_PROJECT_ID ? {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
} : null;

export const firebaseConfig = FROM_ENV || LIVE;

// The one mistake that must be impossible: a dev build quietly falling back to
// the club's live data because its variables were missing. Design work clears
// rosters and saves test players; against the live project that is somebody's
// Saturday. So a dev build aimed at the live project refuses to start at all,
// and says why on the screen rather than in a console nobody opens.
if (IS_DEV && firebaseConfig.projectId === LIVE.projectId) {
    const msg = 'TPPC-Dev is pointed at the live club database, so it has stopped. ' +
        'Set the VITE_FIREBASE_* variables on the tppc-dev Vercel project to the dev Firebase project and redeploy.';
    if (typeof document !== 'undefined') {
        const root = document.getElementById('root');
        if (root) root.innerHTML = `<p style="font:16px/1.5 system-ui,sans-serif;max-width:32em;margin:15vh auto;padding:0 20px">${msg}</p>`;
    }
    throw new Error(msg);
}

export const app = initializeApp(firebaseConfig);

// Plain Firestore (no on-device persistent cache). The persistent IndexedDB
// cache was reverted: on a cold start it could briefly serve a STALE snapshot,
// and the app performs destructive actions on load (the weekly roster auto-clear
// deletes a day's roster based on the value it reads). A stale read there could
// delete a current roster on the server, losing sign-ups. Reading straight from
// the server on cold start avoids that whole class of bug. storage.js imports
// this single `db` instance.
export const db = getFirestore(app);
