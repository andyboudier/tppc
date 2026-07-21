import React from 'react';
import ReactDOM from 'react-dom/client';
import './storage'; // attaches window.storage backed by Firestore
import PoloChukkas from './PoloChukkas.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PoloChukkas />
  </React.StrictMode>
);

// App-shell caching: registering the service worker lets cold starts serve the
// content-hashed JS/CSS from the on-device cache instead of re-downloading them.
// index.html stays network-first inside the worker, so the ~90s web-update path
// is preserved (see public/sw.js). Registration is best-effort — any failure
// (e.g. a WebView without service-worker support) is ignored and the app runs as
// before.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
