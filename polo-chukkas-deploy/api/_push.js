// Browser push notifications (Web Push), sent from the app's own functions.
//
// A device that has switched notifications on (src/push.js) leaves its
// subscription in the shared document `push-subs`, with the signed-in
// account's uid and email. This reads that list and sends to the ones that
// should hear: the admins (decided here, from the admins list, never from
// what the device claimed) and, when someone is booked in from a waiting
// list, that member.
//
// Browsers need VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY on the Vercel project
// (and VITE_VAPID_PUBLIC_KEY, the same public key, for the app). A
// subscription only works with the key pair it was made with, so a leaked
// endpoint is no use without the private key.
//
// The store apps' phones are in the same list as `{ fcm, platform, project }`
// (src/push.js) and are sent through Firebase Cloud Messaging's HTTP v1 API,
// signed with a Firebase service account for the token's project: every
// variable on the Vercel project whose name starts FIREBASE_SERVICE_ACCOUNT
// holds one key's JSON (Firebase console → Project settings → Service
// accounts → Generate new private key), so TPPC-Dev can hold the dev
// project's and the live project's (its Android test app carries the live
// one). Without a key for a token's project that phone is skipped. Either
// kind works without the other.

import { createSign } from 'node:crypto';
import webpush from 'web-push';
import { json, normEmail } from './_reminders.js';

export const pushReady = (env) => !!(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);

// The service accounts on the project, by Firebase project id.
export const serviceAccounts = (env) => {
  const out = {};
  Object.keys(env || {}).filter((k) => /^FIREBASE_SERVICE_ACCOUNT/.test(k)).forEach((k) => {
    try {
      const j = JSON.parse(env[k]);
      if (j && j.project_id && j.client_email && j.private_key) out[j.project_id] = j;
    } catch (e) { /* not a key */ }
  });
  return out;
};

const b64u = (b) => Buffer.from(b).toString('base64').replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');

// A short-lived OAuth token for FCM, from the service account's own key
// (the JWT bearer grant), kept while it lasts.
const tokens = new Map();
async function accessToken(sa, fetchImpl) {
  const had = tokens.get(sa.client_email);
  if (had && had.until > Date.now() + 60000) return had.token;
  const now = Math.floor(Date.now() / 1000);
  const aud = sa.token_uri || 'https://oauth2.googleapis.com/token';
  const unsigned = `${b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64u(JSON.stringify({
    iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud, iat: now, exp: now + 3600,
  }))}`;
  const sig = createSign('RSA-SHA256').update(unsigned).sign(sa.private_key);
  const r = await fetchImpl(aud, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=${encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer')}&assertion=${unsigned}.${b64u(sig)}`,
  });
  if (!r.ok) throw new Error(`token ${r.status}`);
  const j = await r.json();
  tokens.set(sa.client_email, { token: j.access_token, until: Date.now() + (Number(j.expires_in) || 3600) * 1000 });
  return j.access_token;
}

// One FCM message: shown as a notification on the phone, with the address
// to open on a tap (src/push.js) and the tag that groups them.
export const fcmMessage = (token, { title, body, url, tag }) => ({
  message: {
    token,
    notification: { title: String(title || ''), body: String(body || '') },
    data: { url: String(url || ''), tag: String(tag || '') },
    android: { priority: 'HIGH', notification: tag ? { tag: String(tag) } : {} },
    apns: { payload: { aps: { sound: 'default', ...(tag ? { 'thread-id': String(tag) } : {}) } } },
  },
});

// Send `payload` ({ title, body, url, tag }) to every browser and phone whose
// email is in `emails` or uid in `uids`. Failures are counted, never thrown.
export async function pushTo(env, read, { emails = [], uids = [] }, payload, fetchImpl = fetch) {
  const want = new Set(emails.map(normEmail).filter(Boolean));
  const wantUid = new Set(uids.filter(Boolean).map(String));
  const all = json(await read('push-subs'), []).filter((s) => s
    && (want.has(normEmail(s.email)) || (s.uid && wantUid.has(String(s.uid)))));
  const web = pushReady(env) ? all.filter((s) => s.endpoint && s.keys) : [];
  const accounts = serviceAccounts(env);
  const phones = all.filter((s) => s.fcm && accounts[s.project]);
  if (!web.length && !phones.length) return { sent: 0, ...(all.length ? { why: 'No keys for these devices.' } : {}) };
  let sent = 0;
  if (web.length) {
    webpush.setVapidDetails(env.VAPID_SUBJECT || 'mailto:info@tedworthparkpolo.com', env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
    const body = JSON.stringify(payload);
    await Promise.all(web.map(async (s) => {
      try { await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 3600 }); sent += 1; }
      catch (e) { /* gone or refused; the device subscribes again next time */ }
    }));
  }
  await Promise.all(phones.map(async (s) => {
    try {
      const sa = accounts[s.project];
      const r = await fetchImpl(`https://fcm.googleapis.com/v1/projects/${encodeURIComponent(sa.project_id)}/messages:send`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await accessToken(sa, fetchImpl)}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(fcmMessage(s.fcm, payload)),
      });
      if (r.ok) sent += 1;
    } catch (e) { /* the phone switches on again next time */ }
  }));
  return { sent };
}
