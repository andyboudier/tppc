import { initializeApp } from 'firebase/app';
import {
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyBEPZpBeZLmUQdtzGCY7UCIwnGzP8f1xpQ",
    authDomain: "tedworth-park-polo.firebaseapp.com",
    projectId: "tedworth-park-polo",
    storageBucket: "tedworth-park-polo.firebasestorage.app",
    messagingSenderId: "856516284253",
    appId: "1:856516284253:web:68b21c3b23dd8d504062b4"
};

export const app = initializeApp(firebaseConfig);

// Firestore with an on-device (IndexedDB) cache. On a cold start the app serves
// the last-known fixtures/scores from the local cache instantly, then refreshes
// to live from the server — fixing the slow first-load blank screen.
// persistentMultipleTabManager keeps that cache consistent when the app is open
// in more than one tab/window (the club relies on multi-device/tab use). If
// IndexedDB is unavailable (old WebView / private mode), Firestore falls back to
// its in-memory cache automatically, so this never blocks startup.
// NOTE: this is the single Firestore initialisation — storage.js imports `db`
// from here rather than initialising its own, so initializeFirestore always runs
// before any getFirestore call.
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
