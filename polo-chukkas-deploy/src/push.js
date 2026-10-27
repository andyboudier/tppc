// Push notifications on this device (Web Push). The server side is
// api/_push.js; it sends to the admins on every booking event and to a
// member booked in from a waiting list.
//
// Switching on asks the browser's permission, subscribes with the app's
// public VAPID key, and keeps the subscription in the shared `push-subs`
// list with the signed-in account's uid and email, one entry per device.
// Whether the account is an admin is decided on the server, never here.
//
// Works in Chrome, Edge and Firefox, and on an iPhone or iPad only once the
// site has been added to the Home Screen (iOS 16.4 and later).
//
// Inside the store apps the same switch uses the phone's own notifications:
// the native plugin @capacitor-firebase/messaging asks permission and gives a
// Firebase Cloud Messaging token (APNs underneath on an iPhone), and that
// token goes into the same `push-subs` list as `{ fcm, platform, project }`
// beside the browsers' `{ endpoint, keys }`. api/_push.js sends to both
// kinds. An app version without the plugin falls back to "not supported"
// here, as a web view cannot take Web Push.

import { Capacitor, registerPlugin } from '@capacitor/core';
import { firebaseConfig, LIVE_PROJECT_ID } from './firebase';
import { TERMS_CLUB } from './terms.js';

const KEY = String((import.meta.env || {}).VITE_VAPID_PUBLIC_KEY || '');

// ── The store apps ─────────────────────────────────────────────────────────
const nativePush = () => {
  try { return Capacitor.isNativePlatform() && Capacitor.isPluginAvailable('FirebaseMessaging'); }
  catch (e) { return false; }
};
let FM = null;
const messaging = () => FM || (FM = registerPlugin('FirebaseMessaging'));
// Which Firebase project this phone's token belongs to, so the server sends
// it with that project's credentials: the iPhone app carries the site's own
// project (dev or live, chosen when the app is built); the Android app always
// carries the live one.
const nativeProject = () => (Capacitor.getPlatform() === 'android' ? LIVE_PROJECT_ID : firebaseConfig.projectId);
// This phone's own token, kept on the device so its entry can be found again.
const TOKEN_KEY = `${TERMS_CLUB.slug}-push-token`;
const savedToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch (e) { return ''; } };
const keepToken = (t) => { try { if (t) localStorage.setItem(TOKEN_KEY, t); else localStorage.removeItem(TOKEN_KEY); } catch (e) { /* private mode */ } };

// Tapping a notification opens the app where it points (the booking emails'
// "Amend or cancel" address, or the app itself).
if (nativePush()) {
  messaging().addListener('notificationActionPerformed', (e) => {
    const url = e && e.notification && e.notification.data && e.notification.data.url;
    try {
      const to = url ? new URL(url, window.location.href) : null;
      if (to && to.origin === window.location.origin && to.href !== window.location.href) window.location.assign(to.href);
    } catch (err) { /* stay where we are */ }
  }).catch(() => {});
}

export const pushSupported = () => typeof window !== 'undefined' && (nativePush() || (!!KEY
  && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window));

const toKey = (b64) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

// Put this phone's token in the list (replacing an older one of its own).
async function storeNativeToken(token, { uid, email }) {
  const old = savedToken();
  const list = (await readSubs()).filter((s) => s && s.fcm !== token && (!old || s.fcm !== old));
  list.push({ fcm: token, platform: Capacitor.getPlatform(), project: nativeProject(), uid: uid || '', email: String(email || '').trim().toLowerCase(), at: Date.now() });
  await window.storage.set('push-subs', JSON.stringify(list), true);
  keepToken(token);
}

// 'on' | 'off' | 'blocked' | 'unsupported'
export async function pushState({ uid, email } = {}) {
  if (!pushSupported()) return 'unsupported';
  if (nativePush()) {
    try {
      const { receive } = await messaging().checkPermissions();
      if (receive === 'denied') return 'blocked';
      const mine = savedToken();
      if (receive !== 'granted' || !mine) return 'off';
      // Tokens change now and then (a reinstall, a restore); keep the
      // stored one current whenever Home looks.
      const { token } = await messaging().getToken();
      if (token && token !== mine && uid) await storeNativeToken(token, { uid, email });
      return 'on';
    } catch (e) { return 'off'; }
  }
  if (Notification.permission === 'denied') return 'blocked';
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && await reg.pushManager.getSubscription();
    return sub && Notification.permission === 'granted' ? 'on' : 'off';
  } catch (e) { return 'off'; }
}

const readSubs = async () => {
  try { const r = await window.storage.get('push-subs', true); return r && r.value ? JSON.parse(r.value) : []; }
  catch (e) { return []; }
};

export async function enablePush({ uid, email }) {
  if (nativePush()) {
    const { receive } = await messaging().requestPermissions();
    if (receive !== 'granted') throw new Error('Notifications are off for this app — allow them in the phone’s Settings, under the app.');
    const { token } = await messaging().getToken();
    if (!token) throw new Error('The phone did not give a notification address. Try again in a moment.');
    await storeNativeToken(token, { uid, email });
    return 'on';
  }
  if (!pushSupported()) throw new Error('This browser cannot take notifications. On an iPhone, add the app to your Home Screen first.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Notifications are blocked for this site — allow them in the browser’s settings.');
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription())
    || await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toKey(KEY) });
  const j = sub.toJSON();
  const list = (await readSubs()).filter((s) => s && s.endpoint !== j.endpoint);
  list.push({ endpoint: j.endpoint, keys: j.keys, uid: uid || '', email: String(email || '').trim().toLowerCase(), at: Date.now(), ua: navigator.userAgent.slice(0, 80) });
  await window.storage.set('push-subs', JSON.stringify(list), true);
  return 'on';
}

export async function disablePush() {
  if (nativePush()) {
    const mine = savedToken();
    try { await messaging().deleteToken(); } catch (e) { /* already gone */ }
    if (mine) {
      const list = (await readSubs()).filter((s) => s && s.fcm !== mine);
      await window.storage.set('push-subs', JSON.stringify(list), true);
    }
    keepToken('');
    return 'off';
  }
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && await reg.pushManager.getSubscription();
    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      const list = (await readSubs()).filter((s) => s && s.endpoint !== endpoint);
      await window.storage.set('push-subs', JSON.stringify(list), true);
    }
  } catch (e) { /* already gone */ }
  return 'off';
}

// Deleting an account: every device's subscription for it goes from the
// shared list, and this device stops taking them.
export async function forgetPushFor(uid) {
  if (!uid) return;
  if (nativePush()) {
    try { await messaging().deleteToken(); } catch (e) { /* already gone */ }
    keepToken('');
  }
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    const sub = reg && reg.pushManager && await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe().catch(() => {});
  } catch (e) { /* nothing here */ }
  const list = await readSubs();
  const keep = list.filter((s) => s && s.uid !== uid);
  if (keep.length !== list.length) await window.storage.set('push-subs', JSON.stringify(keep), true);
}
