// Browser push notifications (Web Push), sent from the app's own functions.
//
// A device that has switched notifications on (src/push.js) leaves its
// subscription in the shared document `push-subs`, with the signed-in
// account's uid and email. This reads that list and sends to the ones that
// should hear: the admins (decided here, from the admins list, never from
// what the device claimed) and, when someone is booked in from a waiting
// list, that member.
//
// Needs VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY on the Vercel project (and
// VITE_VAPID_PUBLIC_KEY, the same public key, for the app). With them unset
// nothing is sent. A subscription only works with the key pair it was made
// with, so a leaked endpoint is no use without the private key.

import webpush from 'web-push';
import { json, normEmail } from './_reminders.js';

export const pushReady = (env) => !!(env.VAPID_PUBLIC_KEY && env.VAPID_PRIVATE_KEY);

// Send `payload` ({ title, body, url, tag }) to every subscription whose
// email is in `emails` or uid in `uids`. Failures are counted, never thrown.
export async function pushTo(env, read, { emails = [], uids = [] }, payload) {
  if (!pushReady(env)) return { sent: 0, why: 'No VAPID keys.' };
  const want = new Set(emails.map(normEmail).filter(Boolean));
  const wantUid = new Set(uids.filter(Boolean).map(String));
  const subs = json(await read('push-subs'), []).filter((s) => s && s.endpoint && s.keys
    && (want.has(normEmail(s.email)) || (s.uid && wantUid.has(String(s.uid)))));
  if (!subs.length) return { sent: 0 };
  webpush.setVapidDetails(env.VAPID_SUBJECT || 'mailto:info@tedworthparkpolo.com', env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  const body = JSON.stringify(payload);
  let sent = 0;
  await Promise.all(subs.map(async (s) => {
    try { await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 3600 }); sent += 1; }
    catch (e) { /* gone or refused; the device subscribes again next time */ }
  }));
  return { sent };
}
