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
export const db = getFirestore(app);
