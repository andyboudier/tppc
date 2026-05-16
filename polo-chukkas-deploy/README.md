# Tedworth Park Polo Club — Wednesday Chukkas

A booking app that works as **both a website and a phone app**, sharing one live dataset across all club members.

## How it works

- The code is a single React app deployed as a website (e.g. `polo.yourclub.co.uk`)
- That same URL can be **installed on phones** as an app (iOS: Share → Add to Home Screen · Android: tap Install prompt) — it becomes a tappable icon with no browser chrome, indistinguishable from a native app
- Data lives in a **Firebase Firestore database** — every signup, edit, and WhatsApp link is instantly visible to every other device opening the URL

Total cost: **£0/month** on Firebase's and Vercel's free tiers (well within limits for a polo club's usage).

---

## One-time setup (~10 minutes)

### 1 · Create a Firebase project

1. Go to <https://console.firebase.google.com> and click **Add project**
2. Name it e.g. `tppc-chukkas`, accept defaults, skip Google Analytics
3. In the project dashboard, click the **`</>`** web icon → register an app called "polo-chukkas" → copy the `firebaseConfig` object that appears
4. From the left sidebar, click **Build → Firestore Database → Create database** → start in **production mode** → pick the European region (`eur3`)
5. Go to **Rules** and paste this (allows anyone with the URL to read/write — fine for a club; tighten later if needed):

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

   Click **Publish**.

### 2 · Configure the code

1. Paste the `firebaseConfig` object you copied into `src/firebase.js` (replacing the placeholder)
2. That's it — every other file is ready as-is

### 3 · Run it locally first (optional, to test)

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`). Sign up a player on one browser tab and watch it appear instantly on another — that's the live Firestore sync working.

### 4 · Deploy to the web

The easiest path is **Vercel**:

1. Push this folder to a GitHub repo
2. Go to <https://vercel.com> → **Add New Project** → import the repo → click **Deploy**
3. You get a free URL like `polo-chukkas.vercel.app` (or attach your own domain in Settings → Domains)

Alternative: **Netlify** works identically, or run `npm run build` and drag the resulting `dist/` folder to <https://app.netlify.com/drop>.

### 5 · Install as a phone app

Open your deployed URL on a phone:

- **iPhone (Safari):** tap the share button → **Add to Home Screen**
- **Android (Chrome):** tap the menu → **Install app** (or a popup may appear automatically)

The app icon will appear on the home screen. Tap it — opens full-screen, no browser bars, exactly like a native app. All club members do the same. Everyone sees the same roster, schedule, and team draws in real time.

---

## Project layout

```
polo-chukkas/
├── index.html                  ← entry HTML with PWA meta tags
├── package.json                ← dependencies
├── vite.config.js              ← build config
├── public/
│   ├── manifest.webmanifest    ← PWA install manifest
│   └── icon.svg                ← app icon
└── src/
    ├── main.jsx                ← React entry point
    ├── firebase.js             ← Firebase config (you edit this)
    ├── storage.js              ← Firestore-backed storage layer
    └── PoloChukkas.jsx         ← the app (same code as your artifact)
```

The only file you need to edit is `src/firebase.js`.

---

## Useful extras (optional)

### Custom domain
Once on Vercel, add a CNAME for `polo.tedworthparkpolo.com` pointing at `cname.vercel-dns.com`. Vercel auto-provisions an SSL cert.

### Restrict access to club members
Right now anyone with the URL can read and write. To lock it down, you can:

- Add a simple password gate (5 lines of code) — ask if you want this
- Use Firebase Authentication with a "club members only" allowlist
- Move sensitive operations to a Cloud Function

### Tighter Firestore rules
The rules above allow anyone with the URL to read and write. For a club setting this is usually fine, but if you want only authenticated users:

```
match /{document=**} {
  allow read, write: if request.auth != null;
}
```

You'd then need to enable Firebase Authentication and add a login screen.
