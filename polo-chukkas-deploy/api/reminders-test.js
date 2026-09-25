// TEMPORARY — a one-off test of the reminder email, run once by Vercel Cron
// and then removed. It finds the next day (within a week) with a booking for
// someone on REMINDERS_ALLOW and sends that day's reminder, so the test does
// not depend on there being a booking tomorrow. Same guard as the real jobs:
// nothing runs without CRON_SECRET, and only the test list is ever emailed.
import { runReminders } from './_reminders.js';

export default async function handler(req, res) {
  const env = process.env;
  const auth = req.headers && req.headers.authorization;
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) { res.status(401).json({ error: 'Not allowed.' }); return; }
  const safeEnv = { ...env, REMINDERS_LIVE: '' }; // never the whole club from here
  try {
    for (let i = 1; i <= 7; i += 1) {
      const d = new Date(Date.now() + i * 24 * 3600000);
      const iso = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(d);
      const probe = await runReminders({ when: 'evening', env: safeEnv, dry: true, dateOverride: iso });
      if (probe.held.some((h) => h.to !== '(member)')) {
        const report = await runReminders({ when: 'evening', env: safeEnv, dateOverride: iso });
        console.log('reminder test', JSON.stringify(report));
        res.status(200).json(report);
        return;
      }
    }
    console.log('reminder test: no allow-listed bookings in the next week');
    res.status(200).json({ sent: [], note: 'No bookings for the test list in the next week.' });
  } catch (e) {
    console.error('reminder test failed', e);
    res.status(500).json({ error: String((e && e.message) || e) });
  }
}
