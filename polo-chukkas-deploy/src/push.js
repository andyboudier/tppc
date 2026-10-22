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
// site has been added to the Home Screen (iOS 16.4 and later). The store
// apps would need native push (APNs / FCM), which is not wired.

const KEY = String((import.meta.env || {}).VITE_VAPID_PUBLIC_KEY || '');

export const pushSupported = () => typeof window !== 'undefined' && !!KEY
  && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const toKey = (b64) => {
  const pad = '='.repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

// 'on' | 'off' | 'blocked' | 'unsupported'
export async function pushState() {
  if (!pushSupported()) return 'unsupported';
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
  try {
    const reg = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration() : null;
    const sub = reg && reg.pushManager && await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe().catch(() => {});
  } catch (e) { /* nothing here */ }
  const list = await readSubs();
  const keep = list.filter((s) => s && s.uid !== uid);
  if (keep.length !== list.length) await window.storage.set('push-subs', JSON.stringify(keep), true);
}
