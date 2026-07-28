import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ",
    authDomain: "tedworth-park-polo.firebaseapp.com",
    projectId: "tedworth-park-polo",
    storageBucket: "tedworth-park-polo.firebasestorage.app",
    messagingSenderId: "856516284253",
    appId: "1:856516284253:web:68b21c3b23dd8d504062b4"
};

export const app = initializeApp(firebaseConfig);

// Plain Firestore (no on-device persistent cache). The persistent IndexedDB
// cache was reverted: on a cold start it could briefly serve a STALE snapshot,
// and the app performs destructive actions on load (the weekly roster auto-clear
// deletes a day's roster based on the value it reads). A stale read there could
// delete a current roster on the server, losing sign-ups. Reading straight from
// the server on cold start avoids that whole class of bug. storage.js imports
// this single `db` instance.
export const db = getFirestore(app);
